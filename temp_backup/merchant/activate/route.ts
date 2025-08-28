import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

function makeSecret(){ return Math.random().toString(36).slice(2,10); }
function minutesFromNow(m:number){ return new Date(Date.now()+m*60*1000); }

export async function POST(req: Request){
  const session = await auth();
  if(!session?.user?.email) return new Response('Unauthorized', { status: 401 });
  const me = await prisma.user.findUnique({ where:{ email: session.user.email } });
  if(!me) return new Response('Unauthorized', { status: 401 });

  const { dealId, durationMinutes } = await req.json();
  const deal = await prisma.deal.findUnique({ 
    where:{ id: dealId }, 
    include:{ 
      venue: {
        include: {
          merchant: true
        }
      }
    } 
  });
  if(!deal || deal.venue.merchant.userId !== me.id) return new Response('Not found', { status: 404 });

  const updated = await prisma.deal.update({
    where:{ id: deal.id },
    data:{
      status: 'LIVE',
      startAt: new Date(),
      endAt: minutesFromNow(Number(durationMinutes || 120))
    }
  });
  return Response.json({ ok:true, deal: updated });
}

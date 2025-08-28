import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

function minutesFromNow(m:number){ return new Date(Date.now()+m*60*1000); }

export async function POST(req: Request){
  const session = await auth();
  if(!session?.user?.email) return new Response('Unauthorized', { status: 401 });
  const me = await prisma.user.findUnique({ where:{ email: session.user.email } });
  if(!me) return new Response('Unauthorized', { status: 401 });

  const { dealId, addMinutes } = await req.json();
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

  const newExpiry = deal.endAt && addMinutes
    ? new Date(deal.endAt.getTime() + Number(addMinutes)*60*1000)
    : minutesFromNow(Number(addMinutes || 30));

  const updated = await prisma.deal.update({
    where:{ id: deal.id },
    data:{ endAt: newExpiry }
  });
  return Response.json({ ok:true, deal: updated });
}

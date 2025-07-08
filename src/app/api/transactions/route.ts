import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  const { transactionId, totalPrice, games} = await req.json()

  const payload = {
    gross_amount: totalPrice, 
    order_id: transactionId
  }
  const baseUrl = req.nextUrl.origin;

  const res = await fetch(`${baseUrl}/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const {token: token_midtrans} = await res.json()

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 401 })
  }

  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  // Ambil data user dari token
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

  if (userError || !user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  const userId = user.id

  const transactionRecords = {
    user_id: userId,
    transaction_id: transactionId,
    total_price: totalPrice,
  }

  const { data: transactionData, error: transactionError } = await supabaseClient
  .from('transaction')
  .insert(transactionRecords)
  .select()
  .single()

  if (transactionError) {
    return NextResponse.json({ error: transactionError.message }, { status: 500 })
  }

  if(!transactionData){
    return NextResponse.json({ error: 'no data returned' }, { status: 500 })
  }

  const itemsRecords = games.map((item: string) => {
    return{
      transaction_id: transactionData.id,
      game_id: item
    }
  })

  const { data: itemsData, error: itemsError } = await supabaseClient
  .from('transaction_items')
  .insert(itemsRecords)
  .select()

  if(itemsError){
    return NextResponse.json({ error: itemsError.message}, {status: 500})
  }

  return NextResponse.json({ message: 'Insert successful', token_midtrans, transaction_id: transactionData.id}, { status: 200 })
}
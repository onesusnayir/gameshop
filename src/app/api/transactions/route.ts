import supabaseClient from "@/lib/supabaseClient";
import supabaseServer from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from 'next/server'

type Game = {
  id: string;
  name: string;
  price: number;
}

type Transaction = {
    id: string;
    date: string;
    game: Game[];
    tax: number;
    paymentFee: number;
    totalPrice: number;
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 401 })
  }

  // Ambil data user dari token
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

  if (userError || !user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  const userId = user.id
  const body = await req.json()

  // Sisipkan user_id ke setiap objek
  const records = body.game.map((item: any) => ({
    id: body.id,
    user_id: userId,
    game_id: item,
  }))

  const { data, error } = await supabaseClient
  .from('transaction')
  .insert(records)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Insert successful', data }, { status: 200 })
}
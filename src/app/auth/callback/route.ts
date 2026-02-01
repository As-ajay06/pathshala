import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const role = searchParams.get('role') || 'student'

    if (code) {
        const supabase = await createServerSupabaseClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            // Check if profile exists
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', data.user.id)
                .single()

            // Create profile if it doesn't exist
            if (!existingProfile) {
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
                    role: role,
                    avatar_url: data.user.user_metadata?.avatar_url,
                })
            }

            // Redirect based on role
            const redirectPath = role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'
            return NextResponse.redirect(`${origin}${redirectPath}`)
        }
    }

    // Return to login on error
    return NextResponse.redirect(`${origin}/auth/login?error=Could not authenticate`)
}

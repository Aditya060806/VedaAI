import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <SignUp 
      appearance={{
        variables: { colorPrimary: '#ea580c' },
        elements: {
          card: { boxShadow: '0 8px 40px rgba(0,0,0,0.06)', width: '100%', maxWidth: '100%', border: '1px solid #e4e4e7' },
          headerTitle: { fontSize: '24px', fontWeight: '800', color: '#09090b', letterSpacing: '-0.02em' },
          headerSubtitle: { color: '#71717a' },
          formButtonPrimary: { padding: '12px 16px', fontSize: '14px', textTransform: 'none', fontWeight: '600' },
          socialButtonsBlockButton: { padding: '12px 16px', border: '1.5px solid #e4e4e7', color: '#09090b', fontWeight: '600' },
          formFieldInput: { padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #e4e4e7' },
          formFieldLabel: { fontWeight: '600', color: '#09090b' },
          footerActionText: { color: '#71717a' },
          footerActionLink: { color: '#ea580c', fontWeight: '600' }
        }
      }} 
    />
  )
}

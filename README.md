# Memo Application

## Environment Variables Setup

This application requires several environment variables to function properly. For security reasons, these variables should never be committed to version control.

### Setup Instructions

1. Copy the `.env.example` file to a new file named `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual API keys and credentials in the `.env.local` file.

3. Make sure `.env.local` is in your `.gitignore` file to prevent it from being committed to version control.

### Required Environment Variables

- **AI Configuration**
  - `OPENAI_API_KEY`: Your OpenAI API key
  - `ANTHROPIC_API_KEY`: Your Anthropic API key

- **Stripe Configuration**
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
  - `STRIPE_SECRET_KEY`: Your Stripe secret key
  - `NEXT_PUBLIC_URL`: Your application's public URL

- **Supabase Configuration**
  - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Security Best Practices

- Never commit `.env.local` or any file containing actual credentials to version control
- Use environment variables for all sensitive information
- Consider using a secrets management service for production environments
- Regularly rotate your API keys and credentials 
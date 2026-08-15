#!/usr/bin/env bash
# Templated commands to add environment variables to Vercel.
# Replace the <PLACEHOLDER> values with your real secrets, then run this file.
# Requires: `vercel` CLI installed and logged in, and the project set as current.

set -euo pipefail

echo "This script will print vercel env add commands. Edit values before running."

# Example values — REPLACE before using
SUPABASE_URL="<SUPABASE_URL>"
SUPABASE_SERVICE_ROLE_KEY="<SUPABASE_SERVICE_ROLE_KEY>"
NEXT_PUBLIC_SUPABASE_URL="$SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<NEXT_PUBLIC_SUPABASE_ANON_KEY>"
SENDGRID_API_KEY="<SENDGRID_API_KEY>"
TEAM_NOTIFICATION_EMAIL="<team@example.com>"
NOTIFICATION_FROM_EMAIL="<no-reply@example.com>"
SUPABASE_STORAGE_BUCKET="request-attachments"

# Add for Production (repeat for Preview/Development as needed)
vercel env add SUPABASE_URL "$SUPABASE_URL" production
vercel env add SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_SERVICE_ROLE_KEY" production
vercel env add NEXT_PUBLIC_SUPABASE_URL "$NEXT_PUBLIC_SUPABASE_URL" production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY "$NEXT_PUBLIC_SUPABASE_ANON_KEY" production
vercel env add SUPABASE_STORAGE_BUCKET "$SUPABASE_STORAGE_BUCKET" production
vercel env add SENDGRID_API_KEY "$SENDGRID_API_KEY" production
vercel env add TEAM_NOTIFICATION_EMAIL "$TEAM_NOTIFICATION_EMAIL" production
vercel env add NOTIFICATION_FROM_EMAIL "$NOTIFICATION_FROM_EMAIL" production

# To add same variables to Preview and Development, run the same commands with 'preview' and 'development'
# Example:
# vercel env add SUPABASE_URL "$SUPABASE_URL" preview
# vercel env add SUPABASE_URL "$SUPABASE_URL" development

echo "Done. Verify variables in the Vercel dashboard or run 'vercel env ls'."

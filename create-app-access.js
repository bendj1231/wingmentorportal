#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAppAccess() {
  console.log('🔧 Creating app access records for users...');

  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, role');

    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
      return;
    }

    console.log(`Found ${users.length} users`);

    // Define available apps
    const apps = [
      { id: 'foundational', name: 'Foundational Program', required: true },
      { id: 'pilot-profile', name: 'Pilot Profile', required: true },
      { id: 'mentorship', name: 'Mentorship', required: false },
      { id: 'atlas-cv', name: 'ATLAS CV Generator', required: false },
      { id: 'w1000', name: 'W1000 Logbook', required: false }
    ];

    // Create app access for each user
    for (const user of users) {
      console.log(`Creating app access for ${user.email}...`);

      for (const app of apps) {
        const appAccess = {
          user_id: user.id,
          app_id: app.id,
          granted: app.required || user.role === 'super_admin', // Grant access to required apps or super admin
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: insertError } = await supabase
          .from('user_app_access')
          .upsert(appAccess, { onConflict: 'user_id,app_id' });

        if (insertError) {
          console.error(`❌ Error creating app access for ${app.id}:`, insertError.message);
        } else {
          console.log(`   ✅ ${app.name}: ${appAccess.granted ? 'Granted' : 'Restricted'}`);
        }
      }
    }

    // Verify the results
    const { data: accessRecords, error: verifyError } = await supabase
      .from('user_app_access')
      .select('*');

    if (verifyError) {
      console.error('❌ Error verifying app access:', verifyError.message);
    } else {
      console.log(`\n✅ Successfully created ${accessRecords.length} app access records`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

createAppAccess();

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import supabase from './utils/supabase-client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeTokens() {
  try {
    console.log('[Init] Loading tokens configuration...');

    const configPath = join(__dirname, '..', 'tokens-config.json');
    const configFile = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configFile);

    if (!config.tokens || !Array.isArray(config.tokens)) {
      throw new Error('Invalid tokens-config.json format: missing tokens array');
    }

    console.log(`[Init] Found ${config.tokens.length} tokens in configuration`);

    for (const token of config.tokens) {
      if (!token.symbol || !token.mint_address) {
        console.warn('[Init] Skipping token with missing symbol or mint_address:', token);
        continue;
      }

      if (token.mint_address.startsWith('REPLACE_WITH')) {
        console.warn(`[Init] Skipping ${token.symbol} - placeholder mint address`);
        continue;
      }

      const { data: existing, error: selectError } = await supabase
        .from('tokens')
        .select('id, symbol')
        .eq('mint_address', token.mint_address)
        .maybeSingle();

      if (selectError) {
        console.error(`[Init] Error checking for existing token ${token.symbol}:`, selectError);
        continue;
      }

      if (existing) {
        console.log(`[Init] Updating existing token: ${token.symbol}`);

        const updateData = {
          symbol: token.symbol,
          name: token.name,
          emoji_type: token.emoji_type,
          display_color: token.display_color,
          display_order: token.display_order,
          icon_path: token.icon_path,
          is_active: true
        };

        if (token.test_token_name) {
          updateData.name = `${token.name} (${token.test_token_name})`;
        }

        const { error: updateError } = await supabase
          .from('tokens')
          .update(updateData)
          .eq('id', existing.id);

        if (updateError) {
          console.error(`[Init] Error updating token ${token.symbol}:`, updateError);
        } else {
          console.log(`[Init] ✓ Updated ${token.symbol}${token.test_token_name ? ' (Test: ' + token.test_token_name + ')' : ''}`);
        }
      } else {
        console.log(`[Init] Inserting new token: ${token.symbol}`);

        const insertData = {
          symbol: token.symbol,
          name: token.name,
          emoji_type: token.emoji_type,
          mint_address: token.mint_address,
          decimals: token.decimals || 9,
          total_supply: token.total_supply || 1000000000,
          display_color: token.display_color,
          display_order: token.display_order,
          icon_path: token.icon_path,
          is_active: true,
          launch_date: new Date().toISOString()
        };

        if (token.test_token_name) {
          insertData.name = `${token.name} (${token.test_token_name})`;
        }

        const { error: insertError } = await supabase
          .from('tokens')
          .insert(insertData);

        if (insertError) {
          console.error(`[Init] Error inserting token ${token.symbol}:`, insertError);
        } else {
          console.log(`[Init] ✓ Inserted ${token.symbol}${token.test_token_name ? ' (Test: ' + token.test_token_name + ')' : ''}`);
        }
      }
    }

    const { data: allTokens, error: allError } = await supabase
      .from('tokens')
      .select('symbol, mint_address, is_active')
      .order('display_order');

    if (allError) {
      console.error('[Init] Error fetching all tokens:', allError);
    } else {
      console.log('\n[Init] Current tokens in database:');
      allTokens.forEach(t => {
        console.log(`  - ${t.symbol} (${t.mint_address}) ${t.is_active ? '✓' : '✗'}`);
      });
    }

    console.log('\n[Init] ✓ Token initialization complete!');
    process.exit(0);

  } catch (error) {
    console.error('[Init] Fatal error:', error);
    process.exit(1);
  }
}

initializeTokens();

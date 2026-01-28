import { supabase } from './supabase';
import { AcquisitionParams } from './acquisition';

const UTM_TRACKED_KEY = 'utm_tracked';

export interface UTMTrackingRecord {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  msclkid?: string;
  landing_path?: string;
  landing_url?: string;
  referrer?: string;
  captured_at?: string;
  attribution_id?: string;
}

/**
 * Check if UTM data has already been tracked for this attribution_id
 */
export function isUTMTracked(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const tracked = localStorage.getItem(UTM_TRACKED_KEY);
    return tracked === 'true';
  } catch (e) {
    console.error('Failed to check UTM tracking status:', e);
    return false;
  }
}

/**
 * Mark UTM data as tracked
 */
export function markUTMTracked(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(UTM_TRACKED_KEY, 'true');
  } catch (e) {
    console.error('Failed to mark UTM as tracked:', e);
  }
}

/**
 * Insert UTM tracking data to Supabase
 * Only inserts if not already tracked (first-touch attribution)
 */
export async function trackUTMToSupabase(params: AcquisitionParams): Promise<boolean> {
  // Check if already tracked
  if (isUTMTracked()) {
    console.log('[UTM Tracking] Already tracked, skipping insert');
    return false;
  }

  // Prepare the record
  const record: UTMTrackingRecord = {
    utm_source: params.utm_source,
    utm_medium: params.utm_medium,
    utm_campaign: params.utm_campaign,
    utm_content: params.utm_content,
    utm_term: params.utm_term,
    gclid: params.gclid,
    fbclid: params.fbclid,
    ttclid: params.ttclid,
    msclkid: params.msclkid,
    landing_path: params.landing_path,
    landing_url: params.landing_url,
    referrer: params.referrer,
    captured_at: params.captured_at,
    attribution_id: params.attribution_id,
  };

  try {
    console.log('[UTM Tracking] Inserting to Supabase:', record);
    
    const { data, error } = await supabase
      .from('utm_tracking')
      .insert([record])
      .select();

    if (error) {
      console.error('[UTM Tracking] Supabase insert error:', error);
      return false;
    }

    console.log('[UTM Tracking] Successfully inserted:', data);
    markUTMTracked();
    return true;
  } catch (e) {
    console.error('[UTM Tracking] Failed to insert to Supabase:', e);
    return false;
  }
}

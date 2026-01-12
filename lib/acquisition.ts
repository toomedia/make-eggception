const ACQ_KEY = 'acq';

export interface AcquisitionParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
}

export function captureAcquisitionFromUrl(): AcquisitionParams | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const acq: AcquisitionParams = {};

  const keys: (keyof AcquisitionParams)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'gclid',
    'fbclid',
    'ttclid',
  ];

  let hasParams = false;
  keys.forEach((key) => {
    const value = params.get(key);
    if (value) {
      acq[key] = value;
      hasParams = true;
    }
  });

  if (hasParams) {
    try {
      localStorage.setItem(ACQ_KEY, JSON.stringify(acq));
      return acq;
    } catch (e) {
      console.error('Failed to store acquisition params:', e);
    }
  }

  return null;
}

export function getAcquisitionParams(): AcquisitionParams | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(ACQ_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to read acquisition params:', e);
  }

  return null;
}

export function appendAcqParams(url: string): string {
  const acq = getAcquisitionParams();
  if (!acq) return url;

  try {
    const urlObj = new URL(url);
    Object.entries(acq).forEach(([key, value]) => {
      if (value) {
        urlObj.searchParams.set(key, value);
      }
    });
    return urlObj.toString();
  } catch (e) {
    console.error('Failed to append acquisition params:', e);
    return url;
  }
}

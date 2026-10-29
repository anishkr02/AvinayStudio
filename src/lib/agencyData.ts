import { supabase, isSupabaseConfigured } from './supabase';
import { Project, Client, Payment, Invoice } from '@/types';
import { INITIAL_PROJECTS, INITIAL_CLIENTS, INITIAL_PAYMENTS, INITIAL_INVOICES } from '@/data/initialData';

// Check if string is a valid UUID
function isValidUUID(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

// ----------------- IMAGE UPLOADER -----------------
export async function uploadProjectImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const cleanFileName = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.storage
        .from('portfolio')
        .upload(cleanFileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('portfolio')
          .getPublicUrl(cleanFileName);

        if (urlData?.publicUrl) {
          return urlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Storage upload error, using local Data URL fallback:', err);
    }
  }

  // Resilient fallback: read file to Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// ----------------- PROJECTS -----------------
export async function fetchProjects(): Promise<Project[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Supabase fetch projects error:', error.message);
      } else if (data) {
        return data as Project[];
      }
    } catch (err) {
      console.error('Supabase query error:', err);
    }
  }
  return INITIAL_PROJECTS;
}

export async function saveProject(project: Partial<Project> & { id?: string }): Promise<Project> {
  const isExistingUUID = isValidUUID(project.id);
  
  const payload: any = {
    title: project.title || 'Untitled Project',
    client_name: project.client_name || 'Client',
    category: project.category || 'Web Application',
    description: project.description || '',
    image_url: project.image_url || '/images/hero-laptop.jpg',
    live_url: project.live_url || '',
    tags: project.tags || ['Next.js', 'Digital'],
    results_metric: project.results_metric || '',
    featured: project.featured ?? true,
    order_index: project.order_index ?? 99,
  };

  if (isExistingUUID) {
    payload.id = project.id;
  }

  if (isSupabaseConfigured) {
    let result: Project;
    if (isExistingUUID) {
      const { data, error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', project.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase project update error:', error.message);
        throw new Error(`Supabase error: ${error.message}`);
      }
      result = data as Project;
    } else {
      const { data, error } = await supabase
        .from('projects')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('Supabase project insert error:', error.message);
        throw new Error(`Supabase error: ${error.message}`);
      }
      result = data as Project;
    }

    return result;
  }

  throw new Error('Supabase is not configured. Please check your .env.local file.');
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured && isValidUUID(id)) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete error:', error.message);
      throw new Error(`Supabase delete error: ${error.message}`);
    }
    return true;
  }
  return true;
}

// ----------------- CLIENTS -----------------
export async function fetchClients(): Promise<Client[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase clients fetch error:', error.message);
      } else if (data) {
        return data as Client[];
      }
    } catch (err) {
      console.error('Supabase clients error:', err);
    }
  }
  return INITIAL_CLIENTS;
}

export async function saveClient(client: Partial<Client> & { id?: string }): Promise<Client> {
  const isExistingUUID = isValidUUID(client.id);

  const payload: any = {
    business_name: client.business_name || 'Business Name',
    contact_name: client.contact_name || 'Contact Person',
    phone: client.phone || '',
    email: client.email || '',
    location: client.location || 'Assam, India',
    package_selected: client.package_selected || 'Business Website',
    status: client.status || 'Active',
    total_billed: client.total_billed || 0,
    notes: client.notes || '',
  };

  if (isExistingUUID) {
    payload.id = client.id;
  }

  if (isSupabaseConfigured) {
    let result: Client;
    if (isExistingUUID) {
      const { data, error } = await supabase
        .from('clients')
        .update(payload)
        .eq('id', client.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase client update error:', error.message);
        throw new Error(`Supabase error: ${error.message}`);
      }
      result = data as Client;
    } else {
      const { data, error } = await supabase
        .from('clients')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('Supabase client insert error:', error.message);
        throw new Error(`Supabase error: ${error.message}`);
      }
      result = data as Client;
    }

    return result;
  }

  throw new Error('Supabase is not configured.');
}

export async function deleteClient(id: string): Promise<boolean> {
  if (isSupabaseConfigured && isValidUUID(id)) {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete client error:', error.message);
      throw new Error(`Supabase delete client error: ${error.message}`);
    }
    return true;
  }
  return true;
}

// ----------------- PAYMENTS -----------------
export async function fetchPayments(): Promise<Payment[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase payments fetch error:', error.message);
      } else if (data) {
        return data as Payment[];
      }
    } catch (err) {
      console.error('Supabase payments error:', err);
    }
  }
  return INITIAL_PAYMENTS;
}

export async function savePayment(payment: Partial<Payment> & { id?: string }): Promise<Payment> {
  const isExistingUUID = isValidUUID(payment.id);

  const payload: any = {
    client_name: payment.client_name || 'Client',
    project_title: payment.project_title || 'Project Scope',
    invoice_number: payment.invoice_number || `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    total_amount: Number(payment.total_amount) || 0,
    paid_amount: Number(payment.paid_amount) || 0,
    due_date: payment.due_date || new Date().toISOString().split('T')[0],
    payment_method: payment.payment_method || 'UPI (Google Pay / PhonePe)',
    status: payment.status || 'Pending',
  };

  if (isExistingUUID) {
    payload.id = payment.id;
  }

  if (isSupabaseConfigured) {
    let result: Payment;
    if (isExistingUUID) {
      const { data, error } = await supabase
        .from('payments')
        .update(payload)
        .eq('id', payment.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase payment update error:', error.message);
        throw new Error(`Supabase error: ${error.message}`);
      }
      result = data as Payment;
    } else {
      const { data, error } = await supabase
        .from('payments')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('Supabase payment insert error:', error.message);
        throw new Error(`Supabase error: ${error.message}`);
      }
      result = data as Payment;
    }

    return result;
  }

  throw new Error('Supabase is not configured.');
}

export async function deletePayment(id: string): Promise<boolean> {
  if (isSupabaseConfigured && isValidUUID(id)) {
    const { error } = await supabase.from('payments').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete payment error:', error.message);
      throw new Error(`Supabase delete payment error: ${error.message}`);
    }
    return true;
  }
  return true;
}

// ----------------- INVOICES -----------------
export async function fetchInvoices(): Promise<Invoice[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase invoices fetch error:', error.message);
      } else if (data) {
        return data as Invoice[];
      }
    } catch (err) {
      console.error('Supabase invoices error:', err);
    }
  }
  return INITIAL_INVOICES;
}

export async function saveInvoice(invoice: Partial<Invoice> & { id?: string }): Promise<Invoice> {
  const isExistingUUID = isValidUUID(invoice.id);

  const payload: any = {
    invoice_number: invoice.invoice_number || `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    client_name: invoice.client_name || 'Valued Client',
    client_phone: invoice.client_phone || '',
    client_email: invoice.client_email || '',
    client_address: invoice.client_address || 'Assam, India',
    issue_date: invoice.issue_date || new Date().toISOString().split('T')[0],
    due_date: invoice.due_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    items: invoice.items || [{ description: 'Web Development Services', quantity: 1, rate: 15000, amount: 15000 }],
    subtotal: Number(invoice.subtotal) || 15000,
    discount: Number(invoice.discount) || 0,
    total_amount: Number(invoice.total_amount) || 15000,
    status: invoice.status || 'Issued',
    notes: invoice.notes || 'Thank you for choosing AvinayStudio.',
  };

  if (isExistingUUID) {
    payload.id = invoice.id;
  }

  if (isSupabaseConfigured) {
    let result: Invoice;
    if (isExistingUUID) {
      const { data, error } = await supabase
        .from('invoices')
        .update(payload)
        .eq('id', invoice.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase invoice update error:', error.message);
        throw new Error(`Supabase error: ${error.message}`);
      }
      result = data as Invoice;
    } else {
      const { data, error } = await supabase
        .from('invoices')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('Supabase invoice insert error:', error.message);
        throw new Error(`Supabase error: ${error.message}`);
      }
      result = data as Invoice;
    }

    return result;
  }

  throw new Error('Supabase is not configured.');
}

export async function deleteInvoice(id: string): Promise<boolean> {
  if (isSupabaseConfigured && isValidUUID(id)) {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete invoice error:', error.message);
      throw new Error(`Supabase delete invoice error: ${error.message}`);
    }
    return true;
  }
  return true;
}

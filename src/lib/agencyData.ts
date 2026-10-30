import { supabase, isSupabaseConfigured } from './supabase';
import { Project, Client, Payment, Invoice, Lead, LeadInput, LeadStatus } from '@/types';

function requireSupabaseConfigured(): void {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured');
  }
}

function isValidUUID(str?: string): str is string {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export async function uploadProjectImage(file: File): Promise<string> {
  requireSupabaseConfigured();
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image must be 5 MB or smaller');
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const cleanFileName = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
  const { data, error } = await supabase.storage
    .from('portfolio')
    .upload(cleanFileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data: urlData } = supabase.storage
    .from('portfolio')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function fetchProjects(): Promise<Project[]> {
  requireSupabaseConfigured();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as Project[];
}

export async function saveProject(project: Partial<Project> & { id?: string }): Promise<Project> {
  requireSupabaseConfigured();
  const payload: Omit<Project, 'id' | 'created_at'> = {
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

  if (isValidUUID(project.id)) {
    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', project.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data as Project;
  }

  const { data, error } = await supabase
    .from('projects')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Project;
}

export async function deleteProject(id: string): Promise<boolean> {
  requireSupabaseConfigured();
  if (!isValidUUID(id)) {
    throw new Error('Invalid id');
  }

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

export async function fetchClients(): Promise<Client[]> {
  requireSupabaseConfigured();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as Client[];
}

export async function saveClient(client: Partial<Client> & { id?: string }): Promise<Client> {
  requireSupabaseConfigured();
  const payload: Omit<Client, 'id' | 'created_at'> = {
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

  if (isValidUUID(client.id)) {
    const { data, error } = await supabase
      .from('clients')
      .update(payload)
      .eq('id', client.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data as Client;
  }

  const { data, error } = await supabase
    .from('clients')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Client;
}

export async function deleteClient(id: string): Promise<boolean> {
  requireSupabaseConfigured();
  if (!isValidUUID(id)) {
    throw new Error('Invalid id');
  }

  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

export async function fetchPayments(): Promise<Payment[]> {
  requireSupabaseConfigured();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as Payment[];
}

export async function savePayment(payment: Partial<Payment> & { id?: string }): Promise<Payment> {
  requireSupabaseConfigured();
  const payload: Omit<Payment, 'id' | 'created_at'> = {
    client_id: payment.client_id || null,
    client_name: payment.client_name || 'Client',
    project_title: payment.project_title || 'Project Scope',
    invoice_number: payment.invoice_number || `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    total_amount: Number(payment.total_amount) || 0,
    paid_amount: Number(payment.paid_amount) || 0,
    due_date: payment.due_date || new Date().toISOString().split('T')[0],
    payment_method: payment.payment_method || 'UPI (Google Pay / PhonePe)',
    status: payment.status || 'Pending',
  };

  if (isValidUUID(payment.id)) {
    const { data, error } = await supabase
      .from('payments')
      .update(payload)
      .eq('id', payment.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data as Payment;
  }

  const { data, error } = await supabase
    .from('payments')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Payment;
}

export async function deletePayment(id: string): Promise<boolean> {
  requireSupabaseConfigured();
  if (!isValidUUID(id)) {
    throw new Error('Invalid id');
  }

  const { error } = await supabase.from('payments').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

export async function fetchInvoices(): Promise<Invoice[]> {
  requireSupabaseConfigured();
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as Invoice[];
}

export async function saveInvoice(invoice: Partial<Invoice> & { id?: string }): Promise<Invoice> {
  requireSupabaseConfigured();
  const payload: Omit<Invoice, 'id' | 'created_at'> = {
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

  if (isValidUUID(invoice.id)) {
    const { data, error } = await supabase
      .from('invoices')
      .update(payload)
      .eq('id', invoice.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data as Invoice;
  }

  const { data, error } = await supabase
    .from('invoices')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Invoice;
}

export async function deleteInvoice(id: string): Promise<boolean> {
  requireSupabaseConfigured();
  if (!isValidUUID(id)) {
    throw new Error('Invalid id');
  }

  const { error } = await supabase.from('invoices').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

export async function fetchLeads(): Promise<Lead[]> {
  requireSupabaseConfigured();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as Lead[];
}

export async function createLead(input: LeadInput): Promise<void> {
  requireSupabaseConfigured();
  const { error } = await supabase.from('leads').insert({
    name: input.name.trim(),
    phone: input.phone.trim(),
    business: input.business?.trim() || null,
    package: input.package?.trim() || null,
    message: input.message?.trim() || null,
    status: 'New',
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  requireSupabaseConfigured();
  if (!isValidUUID(id)) {
    throw new Error('Invalid id');
  }

  const { error } = await supabase.from('leads').update({ status }).eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteLead(id: string): Promise<void> {
  requireSupabaseConfigured();
  if (!isValidUUID(id)) {
    throw new Error('Invalid id');
  }

  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function convertLeadToClient(lead: Lead): Promise<Client> {
  requireSupabaseConfigured();
  const clientPayload: Omit<Client, 'id' | 'created_at'> = {
    business_name: lead.business || lead.name,
    contact_name: lead.name,
    phone: lead.phone,
    email: '',
    location: 'Assam, India',
    package_selected: lead.package || 'Business Website',
    status: 'In Progress',
    total_billed: 0,
    notes: lead.message || '',
  };

  const { data: client, error: createError } = await supabase
    .from('clients')
    .insert(clientPayload)
    .select()
    .single();

  if (createError) {
    throw new Error(createError.message);
  }
  if (!client) {
    throw new Error('Client could not be created');
  }

  const { error: updateError } = await supabase
    .from('leads')
    .update({ status: 'Converted', converted_client_id: client.id })
    .eq('id', lead.id)
    .select('id')
    .single();

  if (updateError) {
    throw new Error(`The client was created but the lead was not updated: ${updateError.message}`);
  }

  return client as Client;
}

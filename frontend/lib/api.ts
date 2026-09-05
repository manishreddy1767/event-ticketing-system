const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Type definitions matching backend schemas

export type ApiEvent = {
  id: number;
  organizer_id: number;
  title: string;
  description: string | null;
  venue: string;
  event_date: string;
  capacity: number;
  max_discount_percent: number;
  event_type: string;
  registration_mode: "individual" | "team";
  min_team_size: number;
  max_team_size: number;
  registered_count: number;
  status: string;
  certificate_template_path: string | null;
  created_at: string;
};

export type ApiTicketType = {
  id: number;
  event_id: number;
  name: string;
  price: number;
  capacity: number;
  available_quantity: number;
  team_size: number;
};

export type ApiTicket = {
  id: number;
  ticket_type_id: number;
  user_id: number;
  quantity: number;
  total_amount: number;
  discount_percent: number;
  discount_amount: number;
  status: string;
  qr_token: string;
  team_id: number | null;
};

export type ApiTeam = {
  id: number;
  event_id: number;
  name: string;
  leader_id: number;
  created_at: string;
};

export type ApiTeamMember = {
  id: number;
  team_id: number;
  user_id: number;
  joined_at: string;
};

export type ApiTeamInvitation = {
  id: number;
  team_id: number;
  invited_user_id: number;
  status: string;
  created_at: string;
  responded_at: string | null;
};

// Payment response type
export type ApiPayment = {
  id: number;
  ticket_id: number;
  amount: number;
  status: string;
  transaction_id: string | null;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
};

// Razorpay order response
export type ApiPaymentOrder = {
  payment_id: number;
  ticket_id: number;
  amount: number;
  currency: string;
  razorpay_order_id: string;
  razorpay_key_id: string;
};

// Razorpay payment verification response
export type ApiPaymentVerification = {
  id: number;
  ticket_id: number;
  amount: number;
  status: string;
  transaction_id: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
};

export type ApiAttendance = {
  id: number;
  ticket_id: number;
  checked_in_at: string;
  status: string;
  user_id: number;
  user_name: string;
  user_email: string;
  team_name: string | null;
  ticket_type: string;
};

export type ApiCertificate = {
  id: number;
  user_id: number;
  event_id: number;
  certificate_code: string;
  issued_at: string;
};

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
};

export type ApiOrganizerRegisterResponse = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  organization_name: string;
  phone: string;
  description: string | null;
  created_at: string;
};



// Token management

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }

  return null;
}

export function setAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
}

export function clearAccessToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
}

export function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

// Core API request function

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false,
): Promise<T> {
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  // Only set Content-Type when not sending FormData
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)["Content-Type"] =
      "application/json";
  }

  // Add JWT authorization header when required
  if (requiresAuth) {
    const authHeaders = getAuthHeaders();
    Object.assign(headers, authHeaders);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Handle expired/invalid token
    if (response.status === 401) {
      clearAccessToken();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    const errorMessage =
      typeof data?.detail === "string"
        ? data.detail
        : data?.detail
          ? JSON.stringify(data.detail)
          : `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return data;
}

// ============================================================
// Auth endpoints
// ============================================================

export async function registerStudent(data: {
  name: string;
  email: string;
  password: string;
}): Promise<{
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}> {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<{
  access_token: string;
  token_type: string;
  user_id: number;
  role: string;
}> {
  const response = await apiRequest<{
    access_token: string;
    token_type: string;
    user_id: number;
    role: string;
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  setAccessToken(response.access_token);

  return response;
}

export async function registerOrganizer(data: {
  name: string;
  email: string;
  password: string;
  organization_name: string;
  phone: string;
  description?: string;
}): Promise<ApiOrganizerRegisterResponse> {
  return apiRequest("/auth/organizer/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMe(): Promise<ApiUser> {
  return apiRequest("/auth/me", {}, true);
}

export async function updateMyProfile(
  data: {
    name: string;
    email: string;
  },
): Promise<ApiUser> {
  return apiRequest<ApiUser>(
    "/users/me",
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    true,
  );
}

// ============================================================
// Event endpoints
// ============================================================

export async function getEvents(): Promise<ApiEvent[]> {
  return apiRequest<ApiEvent[]>("/events");
}

export async function getEvent(
  eventId: number,
): Promise<ApiEvent> {
  return apiRequest<ApiEvent>(`/events/${eventId}`);
}

export async function getMyEvent(
  eventId: number,
): Promise<ApiEvent> {
  return apiRequest<ApiEvent>(
    `/events/my/${eventId}`,
    {},
    true,
  );
}

export async function getEventTicketTypes(
  eventId: number,
): Promise<ApiTicketType[]> {
  return apiRequest<ApiTicketType[]>(
    `/events/${eventId}/ticket-types`,
  );
}



export async function createEvent(data: {
  title: string;
  description?: string;
  venue: string;
  event_date: string;
  capacity: number;
  event_type: string;
  registration_mode: "individual" | "team";
  min_team_size: number;
  max_team_size: number;
}): Promise<ApiEvent> {
  return apiRequest(
    "/events",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true,
  );
}

export async function updateEvent(
  eventId: number,
  data: {
    title: string;
    description?: string;
    venue: string;
    event_date: string;
    capacity: number;
    max_discount_percent: number;
    event_type: string;
    registration_mode: "individual" | "team";
    min_team_size: number;
    max_team_size: number;
  },
): Promise<ApiEvent> {
  return apiRequest<ApiEvent>(
    `/events/${eventId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    true,
  );
}

export async function getMyEvents(): Promise<ApiEvent[]> {
  return apiRequest<ApiEvent[]>("/events/my", {}, true);
}

// ============================================================
// Ticket Type endpoints
// ============================================================

export async function createTicketType(
  eventId: number,
  data: {
    name: string;
    price: number;
    capacity: number;
    team_size: number;
  },
): Promise<ApiTicketType> {
  return apiRequest(
    `/events/${eventId}/ticket-types`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true,
  );
}

// ============================================================
// Ticket endpoints
// ============================================================

export async function bookTicket(
  eventId: number,
  data: {
    ticket_type_id: number;
    quantity: number;
    team_id?: number;
  },
): Promise<ApiTicket> {
  // Backend route:
  // POST /events/{event_id}/book

  return apiRequest<ApiTicket>(
    `/events/${eventId}/book`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true,
  );
}

export async function getMyTickets(): Promise<ApiTicket[]> {
  return apiRequest<ApiTicket[]>("/events/my-tickets", {}, true);
}

export async function getTicketQr(
  ticketId: number,
): Promise<Blob> {
  const response = await fetch(
    `${API_URL}/events/ticket/${ticketId}/qr`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.detail ||
        `Failed to fetch QR code (${response.status})`,
    );
  }

  return response.blob();
}

export async function getTicket(
  ticketId: number,
): Promise<ApiTicket> {
  return apiRequest<ApiTicket>(
    `/events/ticket/${ticketId}`,
    {},
    true,
  );
}

// ============================================================
// Team endpoints
// ============================================================

export async function createTeam(data: {
  event_id: number;
  name: string;
}): Promise<ApiTeam> {
  return apiRequest(
    "/teams",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true,
  );
}

export async function getTeam(
  teamId: number,
): Promise<ApiTeam> {
  return apiRequest<ApiTeam>(
    `/teams/${teamId}`,
    {},
    true,
  );
}

export async function getMyTeams(): Promise<ApiTeam[]> {
  return apiRequest<ApiTeam[]>("/teams/my", {}, true);
}

export async function getMyTeam(
  teamId: number,
): Promise<ApiTeam> {
  return apiRequest<ApiTeam>(
    `/teams/my/${teamId}`,
    {},
    true,
  );
}

export async function addTeamMember(
  teamId: number,
  userId: number,
): Promise<ApiTeamMember> {
  return apiRequest(
    `/teams/${teamId}/members`,
    {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
      }),
    },
    true,
  );
}

export async function getTeamMembers(
  teamId: number,
): Promise<ApiTeamMember[]> {
  return apiRequest<ApiTeamMember[]>(
    `/teams/${teamId}/members`,
    {},
    true,
  );
}

export async function sendTeamInvitation(
  teamId: number,
  userId: number,
): Promise<ApiTeamInvitation> {
  return apiRequest<ApiTeamInvitation>(
    `/teams/${teamId}/invitations`,
    {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
      }),
    },
    true,
  );
}

export async function deleteTeam(teamId: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/teams/${teamId}`,
    { method: "DELETE" },
    true,
  );
}

export async function leaveTeam(teamId: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/teams/${teamId}/leave`,
    { method: "DELETE" },
    true,
  );
}

export async function getMyTeamInvitations(): Promise<ApiTeamInvitation[]> {
  return apiRequest<ApiTeamInvitation[]>(
    "/teams/invitations",
    {},
    true,
  );
}

export async function acceptTeamInvitation(
  invitationId: number,
): Promise<ApiTeamMember> {
  return apiRequest<ApiTeamMember>(
    `/teams/invitations/${invitationId}/accept`,
    {
      method: "POST",
    },
    true,
  );
}

export async function rejectTeamInvitation(
  invitationId: number,
): Promise<ApiTeamInvitation> {
  return apiRequest<ApiTeamInvitation>(
    `/teams/invitations/${invitationId}/reject`,
    {
      method: "POST",
    },
    true,
  );
}

// ============================================================
// Payment endpoints
// ============================================================

export async function createPaymentOrder(
  ticketId: number,
): Promise<ApiPaymentOrder> {
  return apiRequest<ApiPaymentOrder>(
    "/payments/order",
    {
      method: "POST",
      body: JSON.stringify({
        ticket_id: ticketId,
      }),
    },
    true,
  );
}

export async function verifyPayment(
  data: {
    ticket_id: number;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  },
): Promise<ApiPaymentVerification> {
  return apiRequest<ApiPaymentVerification>(
    "/payments/verify",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true,
  );
}

// ============================================================
// Attendance endpoints
// ============================================================

export async function checkIn(
  value: string | number,
  mode: "qr" | "ticket" = "qr",
): Promise<ApiAttendance> {
  return apiRequest<ApiAttendance>(
    "/attendance/check-in",
    {
      method: "POST",
      body: JSON.stringify(
        mode === "ticket"
          ? { ticket_id: Number(value) }
          : { qr_token: String(value) },
      ),
    },
    true,
  );
}

export async function getEventAttendance(
  eventId: number,
): Promise<ApiAttendance[]> {
  return apiRequest<ApiAttendance[]>(
    `/attendance/events/${eventId}`,
    {},
    true,
  );
}

// ============================================================
// Certificate endpoints
// ============================================================

export async function uploadCertificateTemplate(
  eventId: number,
  file: File,
): Promise<void> {
  const formData = new FormData();

  formData.append("file", file);

  return apiRequest(
    `/certificates/events/${eventId}/template`,
    {
      method: "POST",
      body: formData,
    },
    true,
  );
}

export async function generateCertificate(
  eventId: number,
): Promise<ApiCertificate> {
  return apiRequest<ApiCertificate>(
    `/certificates/events/${eventId}/generate`,
    {
      method: "POST",
    },
    true,
  );
}

export async function getMyCertificates(): Promise<
  ApiCertificate[]
> {
  return apiRequest<ApiCertificate[]>(
    "/certificates/my",
    {},
    true,
  );
}

export async function verifyCertificate(
  certificateCode: string,
): Promise<ApiCertificate> {
  return apiRequest<ApiCertificate>(
    `/certificates/verify/${certificateCode}`,
  );
}

// ============================================================
// Organizer Certificate endpoints
// ============================================================

export type ApiOrganizerCertificate = {
  id: number;
  user_id: number;
  event_id: number;
  certificate_code: string;
  issued_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
};

export async function getEventCertificates(
  eventId: number,
): Promise<ApiOrganizerCertificate[]> {
  return apiRequest<ApiOrganizerCertificate[]>(
    `/certificates/events/${eventId}`,
    {},
    true,
  );
}

// ============================================================
// Organizer Registration endpoints
// ============================================================

export type ApiRegistration = {
  id: number;
  ticket_type: string;
  quantity: number;
  total_amount: number;
  discount_percent: number;
  discount_amount: number;
  status: string;
  qr_token: string;
  team_id: number | null;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
};

export async function getOrganizerRegistrations(
  eventId: number,
): Promise<ApiRegistration[]> {
  return apiRequest<ApiRegistration[]>(
    `/organizers/events/${eventId}/registrations`,
    {},
    true,
  );
}

// ============================================================
// Admin endpoints
// ============================================================

export async function getPendingOrganizers(): Promise<any[]> {
  return apiRequest<any[]>(
    "/admin/organizers",
    {},
    true,
  );
}

export async function approveOrganizer(
  organizerId: number,
): Promise<void> {
  return apiRequest(
    `/admin/organizers/${organizerId}/approve`,
    {
      method: "POST",
    },
    true,
  );
}

export async function rejectOrganizer(
  organizerId: number,
): Promise<void> {
  return apiRequest(
    `/admin/organizers/${organizerId}/reject`,
    {
      method: "POST",
    },
    true,
  );
}

export async function getAllAdminEvents(): Promise<any[]> {
  return apiRequest<any[]>(
    "/admin/events",
    {},
    true,
  );
}

export async function getPendingEvents(): Promise<any[]> {
  return apiRequest<any[]>(
    "/admin/events/pending",
    {},
    true,
  );
}

export async function approveEvent(
  eventId: number,
): Promise<void> {
  return apiRequest(
    `/admin/events/${eventId}/approve`,
    {
      method: "POST",
    },
    true,
  );
}

export async function rejectEvent(
  eventId: number,
): Promise<void> {
  return apiRequest(
    `/admin/events/${eventId}/reject`,
    {
      method: "POST",
    },
    true,
  );
}

export type ApiAdminStats = {
  total_students: number;
  total_organizers: number;
  active_organizers: number;
  total_events: number;
  upcoming_events: number;
  total_registrations: number;
  monthly_registrations: number[];
};

export async function getAdminStats(): Promise<ApiAdminStats> {
  return apiRequest<ApiAdminStats>(
    "/admin/stats",
    {},
    true,
  );
}
export type ApiStudent = {
  id: number;
  name: string;
  email: string;
};

export async function getStudents(): Promise<ApiStudent[]> {
  return apiRequest<ApiStudent[]>("/teams/students", {}, true);
}

export type ApiStudentProfile = {
  roll_number: string | null;
  department: string | null;
  year: string | null;
  college: string | null;
};

export async function getStudentProfile(): Promise<ApiStudentProfile> {
  return apiRequest<ApiStudentProfile>(
    "/users/me/student-profile",
    {},
    true,
  );
}

export async function updateStudentProfile(
  data: {
    roll_number: string;
    department: string;
    year: string;
    college: string;
  },
): Promise<ApiStudentProfile> {
  return apiRequest<ApiStudentProfile>(
    "/users/me/student-profile",
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    true,
  );
}

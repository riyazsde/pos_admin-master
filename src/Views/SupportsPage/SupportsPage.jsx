import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import { BsEnvelopeOpen, BsCheckCircle } from 'react-icons/bs';

import withAdminLayout from '../AdminPanel/withAdminLayout';

// ---------- assets ----------
import smsIcon from '../../assets/Images/admin/Supports/sms.png';
import smsBlue from '../../assets/Images/admin/Supports/sms-blue.png';
import notificationIcon from '../../assets/Images/admin/Supports/sms-notification.png';
import notificationBlue from '../../assets/Images/admin/Supports/sms-notification-blue.png';
import tracking from '../../assets/Images/admin/Supports/sms-tracking.png';
import trackingYellow from '../../assets/Images/admin/Supports/sms-tracking-yellow.png';
import starr from '../../assets/Images/admin/Supports/sms-star.png';
import starrGreen from '../../assets/Images/admin/Supports/sms-star-green.png';
import money from '../../assets/Images/admin/client/money.png';
import bill from '../../assets/Images/admin/client/bill.png';
import globalUser from '../../assets/Images/admin/client/global-user.png';
import successIcon from '../../assets/Images/admin/client/successIcon.png';

// ---------- redux ----------
import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setSummaryLoading,
  setSummaryData,
  setTicketsLoading,
  setTicketsData,
  setUpdating,
  patchTicketStatus,
  setSupportTicketsError,
} from '../../Store/Features/supportTickets/supportTicketsSlice';
import { supportTicketService } from '../../Services/apiService';

// ===========================================================================
// STATUS MAPS
// ===========================================================================
const BACKEND_TO_UI = {
  Pending: 'Pending',
  Open: 'New',
  Process: 'On-Going',
  Solve: 'Resolved',
  Close: 'Closed',
};

const UI_TO_BACKEND = {
  New: 'Open',
  'On-Going': 'Process',
  Resolved: 'Solve',
  Pending: 'Pending',
  Closed: 'Close',
};

const mapBackendStatus = (raw) => {
  if (!raw) return 'New';
  if (BACKEND_TO_UI[raw]) return BACKEND_TO_UI[raw];
  const key = Object.keys(BACKEND_TO_UI).find(
    (k) => k.toLowerCase() === String(raw).toLowerCase()
  );
  return key ? BACKEND_TO_UI[key] : 'New';
};

const mapUiStatusToBackend = (uiLabel) => {
  if (!uiLabel) return null;
  return UI_TO_BACKEND[uiLabel] || null;
};

const STATUS_OPTIONS = ['New', 'On-Going', 'Resolved', 'Pending', 'Closed'];

const STATUS_COLORS = {
  New:        { bg: 'bg-[#2D7FF9]', dot: 'bg-[#2D7FF9]', text: 'text-[#2D7FF9]', border: 'border-[#2D7FF9]' },
  'On-Going': { bg: 'bg-[#F5A623]', dot: 'bg-[#F5A623]', text: 'text-[#F5A623]', border: 'border-[#F5A623]' },
  Resolved:   { bg: 'bg-[#34C759]', dot: 'bg-[#34C759]', text: 'text-[#34C759]', border: 'border-[#34C759]' },
  Pending:    { bg: 'bg-[#FF955A]', dot: 'bg-[#FF955A]', text: 'text-[#FF955A]', border: 'border-[#FF955A]' },
  Closed:     { bg: 'bg-gray-500',  dot: 'bg-gray-500',  text: 'text-gray-600',  border: 'border-gray-600'  },
};

const TABS = [
  { key: 'All Tickets', filter: null,       heading: 'All Tickets' },
  { key: 'New',         filter: 'New',      heading: 'New Tickets' },
  { key: 'On-Going',    filter: 'On-Going', heading: 'Ongoing Tickets' },
  { key: 'Pending',     filter: 'Pending',  heading: 'Pending Tickets' },
  { key: 'Resolved',    filter: 'Resolved', heading: 'Resolved Tickets' },
  { key: 'Closed',      filter: 'Closed',   heading: 'Closed Tickets' },
  { key: 'Escalated',   filter: null,       heading: 'Escalated Tickets' },
];

// ===========================================================================
// HELPERS
// ===========================================================================
const getBusinessName = (ticket) => {
  if (ticket.businessName) return ticket.businessName;
  if (ticket.email) {
    const local = String(ticket.email).split('@')[0];
    return local.replace(/[._-]/g, ' ');
  }
  const createdBy = ticket.CreatedBy;
  if (typeof createdBy === 'string') return createdBy;
  return createdBy?.Name || 'Unknown';
};

const normaliseSummary = (raw) => {
  const d = raw?.data ?? raw ?? {};
  const totalTickets =
    d.totalTickets ?? d.total ?? d.TotalTickets ?? d.total_tickets ?? 0;

  const activeFromFields =
    d.activeTickets ?? d.active ?? d.ActiveTickets ?? d.active_tickets;
  const activeComputed =
    (d.pendingTickets ?? 0) + (d.openTickets ?? 0) + (d.processTickets ?? 0);
  const activeTickets = activeFromFields ?? activeComputed;

  const resolvedFromFields =
    d.resolvedTickets ?? d.resolved ?? d.ResolvedTickets ?? d.resolved_tickets;
  const resolvedComputed = (d.solveTickets ?? 0) + (d.closeTickets ?? 0);
  const resolvedTickets = resolvedFromFields ?? resolvedComputed;

  return { totalTickets, activeTickets, resolvedTickets };
};

const getTicketDbId = (t) =>
  t.Support_Ticket_id ?? t.support_ticket_id ?? t.id;

// ===========================================================================
// SUB-COMPONENTS (inline in this file)
// ===========================================================================

// ---------- Ticket Summary Card ----------
const TicketSummaryCard = ({ title, count, iconBgColor, textColor, icon }) => (
  <div className="w-full shadow-md rounded-2xl bg-white p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
    <div className="flex items-center gap-4 sm:gap-6">
      <div
        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgColor}`}
      >
        <img src={icon} alt="" className="h-6 w-6 sm:h-8 sm:w-8" />
      </div>
      <div className="flex flex-col items-start gap-1 sm:gap-2 min-w-0 flex-1">
        <p className="text-gray-600 font-medium text-sm sm:text-base md:text-lg leading-tight">
          {title}
        </p>
        <h2 className={`font-bold text-xl sm:text-2xl md:text-3xl ${textColor} leading-tight`}>
          {count}
        </h2>
      </div>
    </div>
  </div>
);

// ---------- Search Bar ----------
const SearchBar = ({ onSearch, onFilterChange }) => {
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('Select Priority');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [query, setQuery] = useState('');

  const PRIORITY_OPTIONS = [
    { name: 'New Ticket',      value: 'New',       color: 'bg-blue-500' },
    { name: 'Ongoing Ticket',  value: 'On-Going',  color: 'bg-yellow-500' },
    { name: 'Pending Ticket',  value: 'Pending',   color: 'bg-orange-500' },
    { name: 'Resolved Ticket', value: 'Resolved',  color: 'bg-green-500' },
    { name: 'Closed Ticket',   value: 'Closed',    color: 'bg-gray-500' },
  ];

  const DATE_OPTIONS = [
    'Today', 'Yesterday', 'This Week', 'This Month', 'Three Month', 'Six Month',
  ];

  useEffect(() => {
    const t = setTimeout(() => onSearch?.(query), 300);
    return () => clearTimeout(t);
  }, [query, onSearch]);

  const handlePrioritySelect = (p) => {
    setSelectedPriority(p.name);
    setIsPriorityOpen(false);
    onFilterChange?.({ status: p.value });
  };

  const handlePriorityClear = () => {
    setSelectedPriority('Select Priority');
    setIsPriorityOpen(false);
    onFilterChange?.({ status: null });
  };

  const handleDateSelect = (r) => {
    setSelectedDate(r);
    setIsDateOpen(false);
    onFilterChange?.({ dateRange: r });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-end w-full gap-4">
      <div className="flex items-center px-4 py-2 gap-2 bg-gradient-to-r from-purple-100 to-red-100 rounded-lg w-full md:w-auto">
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for ticket"
          className="bg-transparent outline-none placeholder-gray-500 text-gray-500 text-base font-medium w-full md:w-56"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start md:items-end gap-4 w-full md:w-auto">
        {/* Priority */}
        <div className="relative w-full sm:w-auto">
          <button
            type="button"
            className="flex items-center justify-between sm:justify-center w-full sm:w-auto px-4 py-2 gap-2 border border-black rounded-lg cursor-pointer"
            onClick={() => {
              setIsPriorityOpen(!isPriorityOpen);
              setIsDateOpen(false);
            }}
          >
            <span className="text-black text-base font-normal truncate">
              {selectedPriority}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-black" />
          </button>

          {isPriorityOpen && (
            <div className="absolute top-full left-0 mt-2 w-[246px] bg-white shadow-lg rounded-lg flex flex-col items-start gap-4 px-3 py-5 z-30">
              <button
                type="button"
                onClick={handlePriorityClear}
                className="flex items-center w-full h-8 px-2 py-4 gap-4 border-b border-black/20 text-black bg-white hover:bg-gray-50 rounded"
              >
                Clear filter
              </button>
              {PRIORITY_OPTIONS.map(({ name, value, color }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handlePrioritySelect({ name, value, color })}
                  className={`flex items-center w-full h-8 px-2 py-4 gap-4 border-b border-black/20 font-medium text-base ${
                    selectedPriority === name
                      ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded'
                      : 'text-black bg-white hover:text-white hover:bg-gradient-to-b hover:from-[#6A1B9A] hover:to-[#D32F2F] rounded'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${color}`} />
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="relative w-full sm:w-auto">
          <button
            type="button"
            className="flex items-center justify-between sm:justify-center w-full sm:w-auto px-4 py-2 gap-2 border border-black rounded-lg cursor-pointer"
            onClick={() => {
              setIsDateOpen(!isDateOpen);
              setIsPriorityOpen(false);
            }}
          >
            <span className="text-black text-base font-normal truncate">
              {selectedDate}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-black" />
          </button>

          {isDateOpen && (
            <div className="absolute top-full right-0 mt-2 w-[246px] bg-white shadow-lg rounded-lg flex flex-col items-start gap-4 px-3 py-5 z-30">
              {DATE_OPTIONS.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => handleDateSelect(range)}
                  className={`flex items-center w-full h-8 px-2 py-4 gap-4 border-b border-black/20 font-medium text-base ${
                    selectedDate === range
                      ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded'
                      : 'text-black bg-white hover:text-white hover:bg-gradient-to-b hover:from-[#6A1B9A] hover:to-[#D32F2F] rounded'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------- Status Nav ----------
const TicketStatusNav = ({ activeTab, setActiveTab }) => {
  const tabIcons = {
    'All Tickets': { def: smsBlue,        act: smsIcon,          color: 'text-purple-700',  border: 'border-purple-700' },
    New:           { def: notificationIcon, act: notificationBlue, color: 'text-[#2D7FF9]',   border: 'border-[#2D7FF9]' },
    'On-Going':    { def: tracking,        act: trackingYellow,   color: 'text-[#F5A623]',   border: 'border-[#F5A623]' },
    Pending:       { def: notificationIcon, act: notificationBlue, color: 'text-[#FF955A]',   border: 'border-[#FF955A]' },
    Resolved:      { def: starr,           act: starrGreen,       color: 'text-[#34C759]',   border: 'border-[#34C759]' },
    Closed:        { def: starr,           act: starrGreen,       color: 'text-gray-600',    border: 'border-gray-600' },
    Escalated:     { def: notificationIcon, act: notificationBlue, color: 'text-red-600',     border: 'border-red-600' },
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap items-end gap-6 w-full border-b border-gray-100 pb-2">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const cfg = tabIcons[tab.key];
        const icon = isActive ? cfg.act : cfg.def;
        return (
          <div
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 pb-1 cursor-pointer transition-all duration-200 ${
              isActive
                ? `${cfg.color} border-b-2 ${cfg.border}`
                : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600'
            }`}
          >
            <img src={icon} alt="" className="h-4 w-4 sm:h-5 sm:w-5 object-contain" />
            <span className="font-medium text-sm sm:text-base whitespace-nowrap">
              {tab.key}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ---------- Ticket List Item (card) ----------
const TicketListItem = ({ ticket, isFirst, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const status = ticket.status;
  const cfg = STATUS_COLORS[status] || STATUS_COLORS.New;

  const handleSelect = (option) => {
    setIsOpen(false);
    if (option === status) return;
    onStatusChange?.(ticket.dbId, option); // pass UI status
  };

  const handleCardClick = (e) => {
    if (e.target.closest('[data-status-button]')) return;
    navigate('/ticket-details', { state: { ticket } });
  };

  const postedAt = ticket.createdDate
    ? new Date(ticket.createdDate).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '12:45 AM';

  return (
    <div
      onClick={handleCardClick}
      className={`flex flex-col items-start p-5 sm:p-6 gap-4 w-full bg-gradient-to-b from-purple-50 to-red-50 rounded-xl sm:rounded-2xl cursor-pointer hover:shadow-md transition-shadow border border-purple-100 ${
        isFirst ? '' : 'mt-5'
      }`}
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
          <p className="text-gray-900 font-semibold text-sm sm:text-base">
            Ticket# {ticket.id}
          </p>
        </div>
        <p className="text-gray-500 font-medium text-xs sm:text-sm">
          Posted at {postedAt}
        </p>
      </div>

      <div className="flex justify-between items-start w-full gap-4">
        <h3 className="text-gray-900 font-semibold text-sm sm:text-base flex-1">
          {ticket.title}
        </h3>

        <div className="relative" data-status-button>
          <button
            type="button"
            className={`flex items-center justify-center px-4 py-2 gap-2 ${cfg.bg} rounded-lg cursor-pointer text-sm min-w-[100px]`}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            <img
              src={notificationBlue}
              alt=""
              className="h-4 w-4 filter brightness-0 invert"
            />
            <span className="font-medium text-white">{status}</span>
            {isOpen ? (
              <ChevronUpIcon className="h-3.5 w-3.5 text-white" />
            ) : (
              <ChevronDownIcon className="h-3.5 w-3.5 text-white" />
            )}
          </button>

          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border border-gray-200 z-40 overflow-hidden">
              {STATUS_OPTIONS.map((option) => (
                <div
                  key={option}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                  className={`px-4 py-2.5 cursor-pointer hover:bg-gray-50 flex items-center gap-3 text-sm ${
                    option === status
                      ? 'bg-gray-50 font-semibold text-gray-900'
                      : 'text-gray-700'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[option].dot}`} />
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-700 font-normal text-xs sm:text-sm leading-relaxed w-full line-clamp-3">
        {ticket.description}
      </p>

      <div className="w-full border-b border-gray-300/60" />

      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full bg-cover bg-center border border-purple-200"
            style={{ backgroundImage: 'url(https://via.placeholder.com/28)' }}
          />
          <p className="text-gray-800 font-medium text-xs sm:text-sm">
            {ticket.userName}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/ticket-details', { state: { ticket } });
          }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-red-700 font-semibold text-xs sm:text-sm hover:underline"
        >
          Open Ticket
        </button>
      </div>
    </div>
  );
};

// ---------- Ticket List ----------
const TicketList = ({ tickets, heading, onStatusChange }) => (
  <div className="flex flex-col items-start py-4 w-full max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">{heading}</h2>
    {tickets.length > 0 ? (
      tickets.map((t, i) => (
        <TicketListItem
          key={t.id}
          ticket={t}
          isFirst={i === 0}
          onStatusChange={onStatusChange}
        />
      ))
    ) : (
      <p className="text-center w-full text-gray-600 text-lg">No tickets found.</p>
    )}
  </div>
);

// ===========================================================================
// MAIN PAGE
// ===========================================================================
const SupportsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // read tab from query (?tab=Closed) so refresh / navigation keeps context
  const urlTab = new URLSearchParams(location.search).get('tab');

  const [activeTab, setActiveTab] = useState(urlTab || 'All Tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);

  const { summary, tickets } = useAppSelector((s) => s.supportTickets);
  const hasFetched = useRef(false);

  // Sync URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (activeTab === 'All Tickets') params.delete('tab');
    else params.set('tab', activeTab);
    navigate(`?${params.toString()}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Initial fetch
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      dispatch(setSummaryLoading(true));
      dispatch(setTicketsLoading(true));

      const [summaryRes, ticketsRes] = await Promise.allSettled([
        supportTicketService.getSummary(),
        supportTicketService.getTickets(1, 20),
      ]);

      if (summaryRes.status === 'fulfilled') {
        dispatch(setSummaryData(normaliseSummary(summaryRes.value)));
      } else {
        dispatch(setSummaryData(normaliseSummary(null)));
      }

      if (ticketsRes.status === 'fulfilled') {
        dispatch(setTicketsData(ticketsRes.value));
      } else {
        dispatch(setTicketsData({ data: [], pagination: null }));
        dispatch(
          setSupportTicketsError(
            ticketsRes.reason?.message || 'Failed to load tickets'
          )
        );
        toast.error('Failed to load tickets');
      }
    })();
  }, [dispatch]);

  // Map raw → UI
  const mappedTickets = useMemo(() => {
    const list = Array.isArray(tickets) ? tickets : [];
    return list.map((t) => {
      const rawStatus = t.Ticket_status ?? t.Status ?? t.status;
      const dbId = getTicketDbId(t);
      return {
        id: t.TicketNumber || `TICKET${dbId}`,
        dbId,
        status: mapBackendStatus(rawStatus),
        rawStatus,
        title: t.Subject || t.question || 'No subject',
        description: t.Description || t.question || 'No description',
        userName: getBusinessName(t),
        email: t.email,
        priority: t.Priority || 'Normal',
        createdDate: t.CreatedDate || t.CreateAt,
      };
    });
  }, [tickets]);

  // Filter
  const filteredTickets = useMemo(() => {
    const tabConfig = TABS.find((t) => t.key === activeTab);
    const tabFilter = tabConfig?.filter ?? null;

    return mappedTickets.filter((t) => {
      if (activeTab === 'Escalated') return false;
      if (tabFilter && t.status !== tabFilter) return false;
      if (statusFilter && t.status !== statusFilter) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.userName?.toLowerCase().includes(q) ||
          t.id?.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [mappedTickets, searchQuery, statusFilter, activeTab]);

  // Status update — optimistic + rollback
  const handleStatusUpdate = useCallback(
    async (ticketDbId, newUiStatus) => {
      const backendStatus = mapUiStatusToBackend(newUiStatus);
      if (!backendStatus) {
        toast.error(`Unsupported status: ${newUiStatus}`);
        return;
      }

      // capture previous for rollback
      const before = (tickets || []).find((t) => getTicketDbId(t) === ticketDbId);
      const beforeBackend = before?.Ticket_status ?? before?.Status ?? null;

      // optimistic patch (stores BACKEND value; mapper converts on read)
      dispatch(patchTicketStatus({ id: ticketDbId, status: backendStatus }));

      dispatch(setUpdating(true));
      const toastId = toast.loading(`Moving to ${newUiStatus}...`);

      try {
        const res = await supportTicketService.updateTicketStatus(
          ticketDbId,
          backendStatus
        );
        const newBackend = res?.Ticket_status ?? backendStatus;
        dispatch(patchTicketStatus({ id: ticketDbId, status: newBackend }));

        toast.success(`Moved to ${mapBackendStatus(newBackend)}`, {
          id: toastId,
          duration: 2000,
        });
      } catch (err) {
        if (beforeBackend) {
          dispatch(patchTicketStatus({ id: ticketDbId, status: beforeBackend }));
        }
        console.error('Update status error:', err);
        toast.error('Failed to update status', {
          id: toastId,
          description:
            err?.response?.data?.errors?.[0]?.msg ||
            err?.response?.data?.message ||
            err?.message ||
            'Please try again.',
        });
      } finally {
        dispatch(setUpdating(false));
      }
    },
    [dispatch, tickets]
  );

  const tabConfig = TABS.find((t) => t.key === activeTab);

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Supports &amp; Tickets
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage and respond to client support tickets
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-8 w-full">
        {/* Summary */}
        {activeTab === 'All Tickets' && (
          <div className="w-full flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
            <TicketSummaryCard
              title="Total Tickets"
              count={String(summary?.totalTickets ?? 0)}
              iconBgColor="bg-yellow-200"
              textColor="text-black"
              icon={money}
            />
            <TicketSummaryCard
              title="Total Active Tickets"
              count={String(summary?.activeTickets ?? 0)}
              iconBgColor="bg-pink-200"
              textColor="text-red-500"
              icon={bill}
            />
            <TicketSummaryCard
              title="Total Resolved Tickets"
              count={String(summary?.resolvedTickets ?? 0)}
              iconBgColor="bg-green-200"
              textColor="text-green-500"
              icon={globalUser}
            />
          </div>
        )}

        {/* Search */}
        <SearchBar
          onSearch={setSearchQuery}
          onFilterChange={({ status }) => {
            if (status !== undefined) setStatusFilter(status);
          }}
        />

        {/* Tabs */}
        <TicketStatusNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* List */}
        <div className="w-full">
          <TicketList
            tickets={filteredTickets}
            heading={tabConfig?.heading || 'Tickets'}
            onStatusChange={handleStatusUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(SupportsPage);
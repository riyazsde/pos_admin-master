import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LifeBuoy, AlertCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setSupportTicketsData,
  setSupportTicketsLoading,
} from '../../Store/Features/dashboard/dashboardSlice';
import { dashboardService } from '../../Services/apiService';

// Avatar fallback — cycle through images based on index
import image1 from '../../assets/Images/admin/Dashboard/mcd.png';
import kfc from '../../assets/Images/admin/Dashboard/kfc.png';
import taco from '../../assets/Images/admin/Dashboard/taco.png';
import dalchini from '../../assets/Images/admin/Dashboard/dalchini.png';

const AVATARS = [image1, kfc, taco, dalchini];

// Priority → badge color
const getPriorityStyle = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'low':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'normal':
    default:
      return 'bg-blue-100 text-blue-700 border-blue-200';
  }
};

// Get a short issue preview from Subject or Description
const getIssuePreview = (ticket) => {
  const text = ticket.Subject || ticket.Description || 'No subject';
  const cleaned = text.replace(/\n+/g, ' ').trim();
  return cleaned.length > 30 ? `${cleaned.slice(0, 30)}...` : cleaned;
};

// Get display name from email or CreatedBy
const getDisplayName = (ticket) => {
  if (ticket.email) {
    const localPart = ticket.email.split('@')[0];
    return localPart.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return ticket.CreatedBy || 'Unknown';
};

const SupportTickets = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { supportTickets, supportTicketsLoading } = useAppSelector(
    (state) => state.dashboard
  );

  // ✅ Fetch on mount
  useEffect(() => {
    if (supportTickets && supportTickets.length > 0) return;

    const fetchTickets = async () => {
      dispatch(setSupportTicketsLoading(true));
      try {
        const result = await dashboardService.getSupportTickets(1, 5, 'Open');
        dispatch(setSupportTicketsData(result));
      } catch (err) {
        console.error('Support tickets fetch error:', err);
        dispatch(setSupportTicketsLoading(false));
      }
    };

    fetchTickets();
  }, [dispatch, supportTickets]);

  // ✅ Loading skeleton
  if (supportTicketsLoading && supportTickets.length === 0) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-black font-['Poppins']">
            Open Ticket
          </h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-[30px] shadow-sm h-[400px] p-5 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasData = supportTickets && supportTickets.length > 0;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-black font-['Poppins']">
          Open Ticket
        </h2>
        <button
          className="text-xs sm:text-sm font-semibold text-black font-['Poppins'] hover:underline"
          onClick={() => navigate('/supports')}
        >
          See all
        </button>
      </div>

      {/* Container */}
      <div className="bg-white border border-gray-200 rounded-[30px] shadow-sm h-[400px] flex flex-col overflow-hidden">
        {!hasData ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 px-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
              <LifeBuoy className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              No open tickets
            </p>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              You're all caught up! New tickets will appear here.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-5 no-scrollbar">
            <div className="space-y-4">
              {supportTickets.map((ticket, index) => (
                <div key={ticket.Support_Ticket_id || index}>
                  <div className="flex items-center justify-between gap-3">
                    {/* Left side */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      {/* Avatar */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                        <img
                          src={AVATARS[index % AVATARS.length]}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-black font-['Poppins'] truncate">
                            {getDisplayName(ticket)}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getPriorityStyle(
                              ticket.Priority
                            )}`}
                          >
                            {ticket.Priority}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-400 font-['Poppins'] truncate">
                          {getIssuePreview(ticket)}
                        </span>
                      </div>
                    </div>

                    {/* Resolve button */}
                    <button
                      onClick={() => navigate('/supports')}
                      className="bg-gradient-to-b from-[#7B1FA2] to-[#D32F2F] text-white px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium font-['Poppins'] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                    >
                      Resolve
                    </button>
                  </div>

                  {/* Divider */}
                  {index < supportTickets.length - 1 && (
                    <div className="border-t border-gray-100 mt-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTickets;
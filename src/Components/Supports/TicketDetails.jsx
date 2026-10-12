import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { BsEnvelopeOpen, BsCheckCircle } from 'react-icons/bs';

import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import SuccessPopupModal from './SuccessPopupModal';

import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import {
  setUpdating,
  patchTicketStatus,
  setSupportTicketsError,
} from '../../Store/Features/supportTickets/supportTicketsSlice';
import { supportTicketService } from '../../Services/apiService';
import {
  mapBackendStatus,
  mapUiStatusToBackend,
} from './ticketStatus';

// ---------------------------------------------------------------------------
// Status dropdown — FULLY CONTROLLED, no local status state
// ---------------------------------------------------------------------------
const StatusDropdown = ({ status, onStatusChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = ['New', 'On-Going', 'Resolved', 'Pending', 'Closed'];

  const statusColors = {
    New: 'bg-[#2D7FF9] text-white',
    'On-Going': 'bg-[#F5A623] text-white',
    Resolved: 'bg-[#34C759] text-white',
    Pending: 'bg-[#FF955A] text-white',
    Closed: 'bg-gray-500 text-white',
  };

  const statusIcons = {
    New: <BsEnvelopeOpen className="w-3.5 h-3.5" />,
    'On-Going': <BsEnvelopeOpen className="w-3.5 h-3.5" />,
    Resolved: <BsCheckCircle className="w-3.5 h-3.5" />,
    Pending: <BsEnvelopeOpen className="w-3.5 h-3.5" />,
    Closed: <BsCheckCircle className="w-3.5 h-3.5" />,
  };

  const currentColor = statusColors[status] || statusColors.New;
  const currentIcon = statusIcons[status] || statusIcons.New;

  const handleSelect = (option) => {
    setIsOpen(false);
    if (option === status) return;
    if (onStatusChange) {
      const backendValue = mapUiStatusToBackend(option);
      onStatusChange(backendValue, option);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${currentColor} transition text-sm font-medium disabled:opacity-60`}
      >
        {currentIcon}
        <span>{status}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
          {statusOptions.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2.5 cursor-pointer hover:bg-gray-50 flex items-center gap-3 text-sm ${
                option === status
                  ? 'bg-gray-50 font-semibold'
                  : 'text-gray-700'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  statusColors[option].split(' ')[0]
                }`}
              ></span>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Assign agent dropdown (unchanged)
// ---------------------------------------------------------------------------
const AssignAgentDropdown = ({ value, onChange, agents = [], disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedAgent = agents.find((a) => a.id === value);
  const label = selectedAgent ? selectedAgent.name : 'Select...';

  return (
    <div className="relative w-full max-w-[280px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        <span className={selectedAgent ? 'text-gray-900' : 'text-gray-400'}>
          {label}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
          <div
            onClick={() => {
              onChange(null);
              setIsOpen(false);
            }}
            className="px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer"
          >
            Unassigned
          </div>
          {agents.length === 0 ? (
            <div className="px-4 py-2.5 text-sm text-gray-400">
              No agents available
            </div>
          ) : (
            agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => {
                  onChange(agent.id);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer ${
                  agent.id === value
                    ? 'bg-gray-50 font-medium text-gray-900'
                    : 'text-gray-700'
                }`}
              >
                {agent.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const TicketDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const updating = useAppSelector((state) => state.supportTickets.updating);

  const initial = location.state?.ticket || {};

  const [ticketId] = useState(initial.id || '2023-CS123');
  const [ticketDbId] = useState(initial.dbId || 1);
  const [email, setEmail] = useState(initial.email || 'AOHBars@gmail.com');
  const [businessName, setBusinessName] = useState(
    initial.userName || 'AOH BARS'
  );
  const [subject, setSubject] = useState(
    initial.title || 'Money Deposit not working'
  );
  const [assignedAgent, setAssignedAgent] = useState(null);
  const [reply, setReply] = useState('');
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [status, setStatus] = useState(initial.status || 'New');
  const [showModal, setShowModal] = useState(false);

  const AGENTS = [
    { id: 10, name: 'Sarah Johnson' },
    { id: 11, name: 'Michael Chen' },
    { id: 12, name: 'Emily Martinez' },
  ];

  // -------------------------------------------------------------------------
  // Status change — optimistic + rollback + Redux patch with BACKEND value
  // -------------------------------------------------------------------------
 const handleStatusChange = async (backendStatus, frontendLabel) => {
  if (!backendStatus) return;

  const previousUi = status;
  setStatus(frontendLabel);              // optimistic

  dispatch(setUpdating(true));
  try {
    const res = await supportTicketService.updateTicketStatus(
      ticketDbId,
      backendStatus
    );
    const newBackend = res?.Ticket_status ?? backendStatus;
    const newUi = mapBackendStatus(newBackend);

    setStatus(newUi);
    dispatch(patchTicketStatus({ id: ticketDbId, status: newBackend }));  // ← BACKEND

    toast.success(`Status updated to ${newUi}`);
  } catch (err) {
    setStatus(previousUi);               // rollback
    toast.error('Failed to update status');
  } finally {
    dispatch(setUpdating(false));
  }
};

  // -------------------------------------------------------------------------
  // Reply submit
  // -------------------------------------------------------------------------
  const handleSubmitReply = async () => {
    if (!reply.trim()) {
      toast.error('Please write a reply before submitting');
      return;
    }

    dispatch(setUpdating(true));
    const toastId = toast.loading('Submitting reply...');
    try {
      await supportTicketService.createReply({
        support_ticket_id: ticketDbId,
        reply: reply.trim(),
        employee_id: assignedAgent || 10,
        Ticket_status: 'Process',
        Status: true,
      });

      toast.success('Reply submitted', { id: toastId, duration: 2000 });
      setShowModal(true);
    } catch (err) {
      console.error('Reply error:', err);
      toast.error('Failed to submit reply', {
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
  };

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-[1100px] bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-gray-100 gap-3">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#F5A623]"></span>
            <p className="font-poppins font-semibold text-sm sm:text-base text-gray-900">
              Ticket# {ticketId}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <p className="font-poppins text-xs text-gray-500">
              Posted at{' '}
              {new Date(
                initial.createdDate || Date.now()
              ).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <StatusDropdown
              status={status}
              onStatusChange={handleStatusChange}
              disabled={updating}
            />
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-poppins text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-poppins text-sm font-medium text-gray-800">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-poppins text-sm font-medium text-gray-800">
                Ticket Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-poppins text-sm font-medium text-gray-800">
              Assign Agent
            </label>
            <AssignAgentDropdown
              value={assignedAgent}
              onChange={setAssignedAgent}
              agents={AGENTS}
              disabled={updating}
            />
          </div>

          <div className="space-y-3">
            <label className="font-poppins text-sm font-medium text-gray-800">
              Images Uploaded
            </label>
            <div className="flex flex-wrap gap-3">
              <label className="cursor-pointer">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] rounded-md text-white text-xs font-semibold hover:opacity-90 transition-opacity">
                  Image 02
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setImage2(URL.createObjectURL(file));
                  }}
                />
              </label>

              <label className="cursor-pointer">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] rounded-md text-white text-xs font-semibold hover:opacity-90 transition-opacity">
                  Image 01
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setImage1(URL.createObjectURL(file));
                  }}
                />
              </label>

              {image1 && (
                <img
                  src={image1}
                  alt="Preview 1"
                  className="w-10 h-10 object-cover rounded"
                />
              )}
              {image2 && (
                <img
                  src={image2}
                  alt="Preview 2"
                  className="w-10 h-10 object-cover rounded"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-poppins text-sm font-medium text-gray-800">
              Reply Ticket
            </label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Explain here..."
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm text-gray-800 h-[140px] resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100">
          <button
            onClick={handleSubmitReply}
            disabled={updating}
            className="px-8 py-3 bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {updating ? 'Submitting...' : 'Submit Reply'}
          </button>
        </div>
      </div>

      {showModal && <SuccessPopupModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default withAdminLayout(TicketDetails);
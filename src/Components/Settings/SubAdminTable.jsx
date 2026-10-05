// src/Components/Settings/SubAdminTable.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Pencil,
  Trash2,
  Power,
  PowerOff,
  Search,
  X,
  Loader2,
  UserCog,
  Check,
} from 'lucide-react';

import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import arrow from '../../assets/Images/Home/arrow.png';
import deleteIcon from '../../assets/Images/Settings/1.png';
import CreateSubAdminModal from './CreateSubAdminModal';
import ConfirmationModal from './ConfirmationModalAdmin';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setSubadminsLoading,
  setSubadminsData,
  setSubadminsError,
  updateSubadminInList,
  setUpdating,
  setDeleting,
} from '../../Store/Features/subadmin/subadminSlice';
import { subadminService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Permission types
// ---------------------------------------------------------------------------
const PERMISSION_TYPES = [
  { key: 'Dashboard', value: 'dashboard' },
  { key: 'Clients', value: 'clients' },
  { key: 'Subscriptions', value: 'subscriptions' },
  { key: 'Reports', value: 'reports' },
  { key: 'MDM Device', value: 'mdm device' },
  { key: 'Inventory', value: 'inventory' },
  { key: 'Audits Log', value: 'audits log' },
  { key: 'Support Tickets', value: 'support tickets' },
  { key: 'POS Devices', value: 'pos devices' },
  { key: 'Settings', value: 'settings' },
];

// ---------------------------------------------------------------------------
// Edit Modal
// ---------------------------------------------------------------------------
const EditSubadminModal = ({ subadmin, onClose, onSave, saving }) => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    Name: subadmin?.Name || '',
    last_name: subadmin?.last_name || '',
    email: subadmin?.email || '',
    phone: subadmin?.phone || '',
    Responsibility_id: subadmin?.Responsibility_id || 1,
    Status: subadmin?.Status ?? true,
    permissions: (subadmin?.SubAdmin_Permissions?.IsPermissons || [])
      .filter((p) => p.status)
      .map((p) => String(p.type).toLowerCase()),
  });

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const togglePermission = (permValue) => {
    setForm((p) => ({
      ...p,
      permissions: p.permissions.includes(permValue)
        ? p.permissions.filter((x) => x !== permValue)
        : [...p.permissions, permValue],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.Name.trim()) {
      toast.error(t('subadmin.validation.nameRequired'));
      return;
    }
    if (!form.email.trim()) {
      toast.error(t('subadmin.validation.emailRequired'));
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            {t('subadmin.editTitle')}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                {t('subadmin.form.firstName')}
              </label>
              <input
                type="text"
                value={form.Name}
                onChange={(e) => update('Name', e.target.value)}
                disabled={saving}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                {t('subadmin.form.lastName')}
              </label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => update('last_name', e.target.value)}
                disabled={saving}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                {t('subadmin.form.email')}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                disabled={saving}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                {t('subadmin.form.phone')}
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                disabled={saving}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                {t('subadmin.form.responsibility')}
              </label>
              <select
                value={form.Responsibility_id}
                onChange={(e) =>
                  update('Responsibility_id', Number(e.target.value))
                }
                disabled={saving}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={1}>Restaurant Owner</option>
                <option value={2}>Manager</option>
                <option value={3}>Cashier</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                {t('subadmin.form.status')}
              </label>
              <div className="flex items-center gap-3 h-[42px]">
                <input
                  type="checkbox"
                  id="status-toggle"
                  checked={form.Status}
                  onChange={(e) => update('Status', e.target.checked)}
                  disabled={saving}
                  className="w-5 h-5 accent-purple-600"
                />
                <label
                  htmlFor="status-toggle"
                  className="text-sm text-gray-700"
                >
                  {form.Status
                    ? t('subadmin.active')
                    : t('subadmin.inactive')}
                </label>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {t('subadmin.form.permissions')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {PERMISSION_TYPES.map((p) => {
                const isChecked = form.permissions.includes(p.value);
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => togglePermission(p.value)}
                    disabled={saving}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left ${
                      isChecked
                        ? 'bg-purple-50 border-purple-200 text-purple-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-purple-200'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked
                          ? 'bg-purple-600 border-purple-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 text-white" />}
                    </span>
                    <span className="truncate">{p.key}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] rounded-lg hover:opacity-95 disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('subadmin.saving')}
              </>
            ) : (
              t('common.save')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const SubAdminTable = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { subadmins, pagination, loading, hasLoaded } = useAppSelector(
    (state) => state.subadmin
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // ✅ Reusable refetch
  const refetchList = async () => {
    const refetched = await subadminService.getAll({
      page: 1,
      limit: 10,
      status: true,
    });
    dispatch(setSubadminsData(refetched));
    return refetched;
  };

  // Fetch once on mount
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      dispatch(setSubadminsLoading(true));
      try {
        const result = await subadminService.getAll({
          page: 1,
          limit: 10,
          status: true,
        });
        dispatch(setSubadminsData(result));
      } catch (err) {
        console.error('Subadmin fetch error:', err);
        dispatch(setSubadminsError(err?.message || 'Failed to load'));
        toast.error(t('subadmin.loadFailed'), {
          description: err?.message || t('common.error'),
        });
      }
    };

    fetchData();
  }, [dispatch, t]);

  // Filter by search
  const filtered = subadmins.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.Name?.toLowerCase().includes(q) ||
      s.last_name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.Employee_id?.toLowerCase().includes(q)
    );
  });

  const isEmpty = filtered.length === 0;

  // ---------------- Actions ----------------
  const handleEditSave = async (form) => {
    setSavingEdit(true);
    dispatch(setUpdating(true));
    const toastId = toast.loading(t('subadmin.updating'));

    try {
      // ✅ Payload matching Postman EXACTLY (no last_name)
      const payload = {
        Name: form.Name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        Responsibility_id: Number(form.Responsibility_id) || 1,
        Status: form.Status,
        IsPermissons: form.permissions,
      };

      console.log('📤 [UPDATE] id:', editing.user_id);
      console.log('📤 [UPDATE] payload:', payload);

      // 1. Fire the API
      await subadminService.update(editing.user_id, payload);

      // 2. ✅ Update the row in Redux IMMEDIATELY (guaranteed visual fix)
      dispatch(
        updateSubadminInList({
          user_id: editing.user_id,
          Name: payload.Name,
          email: payload.email,
          phone: payload.phone,
          Responsibility_id: payload.Responsibility_id,
          Status: payload.Status,
          SubAdmin_Permissions: {
            ...(editing.SubAdmin_Permissions || {}),
            IsPermissons: payload.IsPermissons.map((p) => ({
              type: p,
              status: true,
            })),
          },
        })
      );

      // 3. Background refetch (syncs any server-side transformations)
      refetchList().catch((err) =>
        console.warn('Background refetch failed:', err)
      );

      toast.success(t('subadmin.updateSuccess'), { id: toastId });
      setEditing(null);
    } catch (err) {
      console.error('❌ [UPDATE] error:', err);
      toast.error(t('subadmin.updateFailed'), {
        id: toastId,
        description:
          err?.response?.data?.errors?.[0]?.msg ||
          err?.response?.data?.message ||
          err?.message ||
          t('common.error'),
      });
    } finally {
      setSavingEdit(false);
      dispatch(setUpdating(false));
    }
  };

  const handleConfirmDelete = async () => {
    setDeletingId(editing.user_id);
    dispatch(setDeleting(true));
    const toastId = toast.loading(t('subadmin.deleting'));

    try {
      console.log('📤 [DELETE] id:', editing.user_id);
      await subadminService.remove(editing.user_id);
      await refetchList();

      toast.success(t('subadmin.deleteSuccess'), { id: toastId });
      setConfirmDeleteOpen(false);
      setEditing(null);
    } catch (err) {
      console.error('❌ [DELETE] error:', err);
      toast.error(t('subadmin.deleteFailed'), {
        id: toastId,
        description:
          err?.response?.data?.message || err?.message || t('common.error'),
      });
    } finally {
      setDeletingId(null);
      dispatch(setDeleting(false));
    }
  };

  const handleToggleStatus = async (sub, newStatus) => {
    const toastId = toast.loading(
      newStatus ? t('subadmin.activating') : t('subadmin.deactivating')
    );

    try {
      console.log(
        `📤 [${newStatus ? 'ACTIVATE' : 'DEACTIVATE'}] id:`,
        sub.user_id
      );

      if (newStatus) {
        await subadminService.activate(sub.user_id);
      } else {
        await subadminService.deactivate(sub.user_id);
      }

      await refetchList();

      toast.success(
        newStatus
          ? t('subadmin.activateSuccess')
          : t('subadmin.deactivateSuccess'),
        { id: toastId }
      );
    } catch (err) {
      console.error(
        `❌ [${newStatus ? 'ACTIVATE' : 'DEACTIVATE'}] error:`,
        err
      );
      toast.error(
        newStatus
          ? t('subadmin.activateFailed')
          : t('subadmin.deactivateFailed'),
        {
          id: toastId,
          description:
            err?.response?.data?.message ||
            err?.message ||
            t('common.error'),
        }
      );
    }
  };

  // ---------------- Render ----------------
  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex flex-wrap items-center gap-2 text-[28px] md:text-[32px]">
          <span className="text-gray-400 flex items-center gap-2">
            {t('nav.settings')}
            <img src={arrow} alt="Arrow" className="w-4 h-4 inline-block" />
          </span>
          {t('subadmin.title')}
        </h1>

        <button
          className="text-white px-4 py-2 rounded-md font-medium shadow w-full md:w-auto"
          style={{
            background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
          }}
          onClick={() => setIsCreateOpen(true)}
        >
          {t('subadmin.createButton')}
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('subadmin.searchPlaceholder')}
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-300 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-b from-purple-100 to-red-100 py-3 px-6 grid grid-cols-6 gap-2 text-sm font-semibold text-gray-600">
          <div>{t('subadmin.table.sno')}</div>
          <div>{t('subadmin.table.name')}</div>
          <div>{t('subadmin.table.email')}</div>
          <div>{t('subadmin.table.permissions')}</div>
          <div>{t('subadmin.table.status')}</div>
          <div className="text-center">{t('subadmin.table.action')}</div>
        </div>

        {/* Body */}
        {loading && !hasLoaded ? (
          <div className="p-10 flex flex-col items-center justify-center text-gray-400 gap-3 bg-white">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">{t('subadmin.loading')}</span>
          </div>
        ) : isEmpty ? (
          <div className="p-10 flex flex-col items-center justify-center text-gray-400 gap-3 bg-white">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
              <UserCog className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              {t('subadmin.noData')}
            </p>
            <p className="text-xs text-gray-400">{t('subadmin.noDataDesc')}</p>
          </div>
        ) : (
          filtered.map((sub, idx) => {
            const permissions = (
              sub.SubAdmin_Permissions?.IsPermissons || []
            ).filter((p) => p.status);

            return (
              <div
                key={sub._id || idx}
                className="grid grid-cols-6 gap-2 px-6 py-4 border-t border-gray-300 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm text-gray-600 tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    {sub.Name} {sub.last_name}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {sub.Employee_id || ''}
                  </div>
                </div>
                <div className="text-sm text-gray-700 break-words truncate">
                  {sub.email}
                </div>
                <div className="flex flex-wrap gap-1">
                  {permissions.length === 0 ? (
                    <span className="text-xs text-gray-400 italic">
                      {t('subadmin.noPermissions')}
                    </span>
                  ) : (
                    permissions.slice(0, 3).map((perm, i) => (
                      <span
                        key={i}
                        className="bg-pink-100 text-black text-[10px] font-semibold px-2 py-0.5 rounded-md"
                      >
                        {perm.type}
                      </span>
                    ))
                  )}
                  {permissions.length > 3 && (
                    <span className="text-[10px] text-gray-500">
                      +{permissions.length - 3}
                    </span>
                  )}
                </div>
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      sub.Status
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        sub.Status ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                    {sub.Status
                      ? t('subadmin.active')
                      : t('subadmin.inactive')}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  {/* Toggle status */}
                  <button
                    onClick={() => handleToggleStatus(sub, !sub.Status)}
                    title={
                      sub.Status
                        ? t('subadmin.deactivate')
                        : t('subadmin.activate')
                    }
                    className={`p-2 rounded-full transition-colors ${
                      sub.Status
                        ? 'text-orange-500 hover:bg-orange-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {sub.Status ? (
                      <PowerOff className="w-4 h-4" />
                    ) : (
                      <Power className="w-4 h-4" />
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() => {
                      setEditing(sub);
                      setConfirmDeleteOpen(true);
                    }}
                    title={t('common.delete')}
                  >
                    <img
                      src={deleteIcon}
                      alt="delete"
                      className="w-5 h-5"
                    />
                  </button>

                  {/* Edit */}
                  <button
                    className="p-2 rounded-full bg-black hover:bg-gray-800"
                    onClick={() => setEditing(sub)}
                    title={t('common.edit')}
                  >
                    <Pencil className="text-white w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination footer */}
      {!isEmpty && pagination && (
        <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
          <span>
            {t('subadmin.showing', {
              count: filtered.length,
              total: pagination.total,
            })}
          </span>
          <span>
            {t('subadmin.page', {
              page: pagination.page,
              pages: pagination.pages || 1,
            })}
          </span>
        </div>
      )}

      {/* Create Modal */}
      {isCreateOpen && (
        <CreateSubAdminModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={async () => {
            await refetchList();
          }}
        />
      )}

      {/* Edit Modal */}
      {editing && !confirmDeleteOpen && (
        <EditSubadminModal
          subadmin={editing}
          onClose={() => setEditing(null)}
          onSave={handleEditSave}
          saving={savingEdit}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setEditing(null);
        }}
        onConfirm={handleConfirmDelete}
        title={t('subadmin.deleteTitle')}
        description={t('subadmin.deleteConfirm', {
          name: editing
            ? `${editing.Name} ${editing.last_name || ''}`.trim()
            : '',
        })}
        loading={deletingId === editing?.user_id}
      />
    </div>
  );
};

export default withAdminLayout(SubAdminTable);
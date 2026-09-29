import { Pencil } from "lucide-react";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import arrow from '../../assets/Images/Home/arrow.png';
import deleteIcon from '../../assets/Images/Settings/1.png';
import { useState } from "react";
import CreateSubAdminModal from "./CreateSubAdminModal";
import ConfirmationModal from "./ConfirmationModalAdmin";

const subAdmins = [
  {
    id: "01",
    name: "Thomas",
    email: "Thomassubadmin@Triaxx.com",
    password: "233kjhboh@1",
    permissions: ["Dashboard", "Reports", "Subscriptions", "Clients"]
  },
  {
    id: "02",
    name: "Edison",
    email: "Edisonsubadmin@Triaxx.com",
    password: "233kjhboh@1",
    permissions: ["Account Settings", "Sub Admin", "Payments", "Dashboard", "Reports", "Subscriptions", "Clients"]
  },
  {
    id: "03",
    name: "Charles",
    email: "Charlesubadmin@Triaxx.com",
    password: "233kjhboh@1",
    permissions: ["Dashboard", "Reports"]
  }
];

const SubAdminTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleConfirmDelete = () => {
    setIsModalOpen(false);
  };

  const [open, setOpen] = useState(false);

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex flex-wrap items-center gap-2 text-[28px] md:text-[32px]">
          <span className="text-gray-400 flex items-center gap-2">
            Account Settings
            <img src={arrow} alt="Arrow" className="w-4 h-4 inline-block" />
          </span>
          Sub Admins
        </h1>

        <button
          className="text-white px-4 py-2 rounded-md font-medium shadow w-full md:w-auto"
          style={{ background: "linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)" }}
          onClick={() => setOpen(true)}
        >
          Create Sub admin +
        </button>
      </div>

      {/* Table - scrolls horizontally on small screens */}
      <div className="border border-gray-300 rounded-t-xl overflow-x-auto">
        <div className="min-w-[1024px]">
          {/* Table Header */}
          <div className="bg-gradient-to-b from-purple-100 to-red-100 py-3 px-6 grid grid-cols-6 gap-2 text-sm font-semibold text-gray-600">
            <div>S no</div>
            <div>Name</div>
            <div>Email</div>
            <div>Password</div>
            <div>Permissions</div>
            <div className="text-center">Actions</div>
          </div>

          {/* Table Rows */}
          {subAdmins.map((admin) => (
            <div
              key={admin.id}
              className="grid grid-cols-6 gap-2 px-6 py-4 border-t border-gray-300 bg-white"
            >
              <div>{admin.id}</div>
              <div>{admin.name}</div>
              <div className="break-words">{admin.email}</div>
              <div>{admin.password}</div>
              <div className="flex flex-wrap gap-2">
                {admin.permissions.map((perm, index) => (
                  <span
                    key={index}
                    className="bg-pink-100 text-black text-sm font-semibold px-2 py-1 rounded-md"
                  >
                    {perm}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4">
                <button className="p-2" onClick={handleOpenModal}>
                  <img src={deleteIcon} alt="delete" className="w-5 h-5" />
                </button>
                <button
                  className="p-2 rounded-full bg-black"
                  onClick={() => setOpen(true)}
                >
                  <Pencil className="text-white w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {open && <CreateSubAdminModal onClose={() => setOpen(false)} />}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Are you sure?"
        description="You can see your employee's roles and responsibilities. You can delete your employees as well."
      />
    </div>
  );
};

export default withAdminLayout(SubAdminTable);

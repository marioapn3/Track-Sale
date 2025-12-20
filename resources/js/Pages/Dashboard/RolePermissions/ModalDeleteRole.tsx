import { Role } from "../../../api/features/dashboard/roles-permissions/Types";
import { deleteRole } from "../../../api/features/dashboard/roles-permissions";
import ModalDelete from "../../../components/ui/modal/ModalDelete";

interface ModalDeleteRoleProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    role: Role | null;
}

export default function ModalDeleteRole({
    isOpen,
    onClose,
    onSuccess,
    role,
}: ModalDeleteRoleProps) {
    if (!role) return null;

    const handleConfirm = async () => {
        await deleteRole(role.id);
        onSuccess();
    };

    return (
        <ModalDelete
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleConfirm}
            title="Delete Role"
            description="Are you sure you want to delete this role? This action cannot be undone."
            itemName={role.name}
            itemDetails={
                role.guard_name ? (
                    <>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Guard
                        </div>
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {role.guard_name}
                        </div>
                    </>
                ) : undefined
            }
            confirmButtonText="Delete Role"
        />
    );
}


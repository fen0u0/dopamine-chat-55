import OnboardingWizard from "@/components/OnboardingWizard";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const EditProfileModal = ({ isOpen, onClose, onSave }: EditProfileModalProps) => (
  <OnboardingWizard open={isOpen} onClose={() => { onSave?.(); onClose(); }} editMode />
);

export default EditProfileModal;

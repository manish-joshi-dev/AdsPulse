import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmDialog = ({ isOpen, onClose, title, message, onConfirm, isDestructive }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="mt-2 text-zinc-600">{message}</p>
    <div className="mt-6 flex justify-end gap-3">
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button variant={isDestructive ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>Confirm</Button>
    </div>
  </Modal>
);

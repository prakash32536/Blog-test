import React from 'react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationProps {
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ onDelete, onCancel }) => {
  return (
    <div className="p-4 space-y-4">
      <p className="text-sm text-gray-500">
        Are you sure you want to delete this blog? This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
import React, { useState } from 'react';
import { Applicant, ApplicationStatus } from '../types.ts';
import ModalHeader from './ModalHeader.tsx';

export interface ApplicantData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  applyingForClass: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
}

interface ApplicantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (applicant: ApplicantData) => void;
  applicant?: Applicant | null;
}

const ApplicantFormModal: React.FC<ApplicantFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  applicant
}) => {
  const [formData, setFormData] = useState<ApplicantData>({
    name: applicant?.name || '',
    email: applicant?.email || '',
    phone: applicant?.phone || '',
    address: applicant?.address || '',
    dateOfBirth: applicant?.dateOfBirth || '',
    applyingForClass: applicant?.applyingForClass || '',
    parentName: applicant?.parentName || '',
    parentPhone: applicant?.parentPhone || '',
    parentEmail: applicant?.parentEmail || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <ModalHeader title={applicant ? 'Edit Applicant' : 'New Applicant'} onClose={onClose} />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date of Birth</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Applying for Class</span>
              </label>
              <select
                name="applyingForClass"
                value={formData.applyingForClass}
                onChange={handleInputChange}
                className="select select-bordered"
                required
              >
                <option value="">Select Class</option>
                <option value="Nursery 1">Nursery 1</option>
                <option value="Nursery 2">Nursery 2</option>
                <option value="Primary 1">Primary 1</option>
                <option value="Primary 2">Primary 2</option>
                <option value="Primary 3">Primary 3</option>
                <option value="Primary 4">Primary 4</option>
                <option value="Primary 5">Primary 5</option>
                <option value="Primary 6">Primary 6</option>
                <option value="JSS 1">JSS 1</option>
                <option value="JSS 2">JSS 2</option>
                <option value="JSS 3">JSS 3</option>
                <option value="SS 1">SS 1</option>
                <option value="SS 2">SS 2</option>
                <option value="SS 3">SS 3</option>
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Parent Name</span>
              </label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Parent Phone</span>
              </label>
              <input
                type="tel"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Parent Email</span>
              </label>
              <input
                type="email"
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
          </div>
          
          <div className="form-control col-span-2">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="input input-bordered"
              required
            />
          </div>
          
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {applicant ? 'Update' : 'Submit'} Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicantFormModal;
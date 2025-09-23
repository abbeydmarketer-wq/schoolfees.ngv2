import React from 'react';
import { School, PlatformConfig } from '../types';

interface CommunicationPageProps {
  school: School;
  platformConfig: PlatformConfig;
}

const CommunicationPage: React.FC<CommunicationPageProps> = ({ school, platformConfig }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Communication</h1>
        <button className="btn btn-primary">
          New Message
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Send Messages</h2>
            <p className="text-gray-600">Communicate with students, parents, and staff</p>
            
            <div className="space-y-4 mt-4">
              <button className="btn btn-outline w-full">
                Send to All Parents
              </button>
              <button className="btn btn-outline w-full">
                Send to All Students
              </button>
              <button className="btn btn-outline w-full">
                Send to Staff
              </button>
              <button className="btn btn-outline w-full">
                Custom Recipients
              </button>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Communication Settings</h2>
            <p className="text-gray-600">Configure notification preferences</p>
            
            <div className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Email Notifications</span>
                  <input type="checkbox" className="checkbox" defaultChecked={school.settings.notifications.emailEnabled} />
                </label>
              </div>
              
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">SMS Notifications</span>
                  <input type="checkbox" className="checkbox" defaultChecked={school.settings.notifications.smsEnabled} />
                </label>
              </div>
              
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">WhatsApp Notifications</span>
                  <input type="checkbox" className="checkbox" defaultChecked={school.settings.notifications.whatsappEnabled} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recent Communications</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Recipients</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2025-09-23</td>
                  <td>School Reopening Notice</td>
                  <td>All Parents</td>
                  <td><span className="badge badge-success">Sent</span></td>
                </tr>
                <tr>
                  <td>2025-09-22</td>
                  <td>Fee Payment Reminder</td>
                  <td>Outstanding Debtors</td>
                  <td><span className="badge badge-success">Sent</span></td>
                </tr>
                <tr>
                  <td>2025-09-21</td>
                  <td>Staff Meeting Notice</td>
                  <td>All Staff</td>
                  <td><span className="badge badge-success">Sent</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPage;
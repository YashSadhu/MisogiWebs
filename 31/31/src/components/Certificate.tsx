import React from 'react';

interface CertificateProps {
  eventName: string;
  participantName: string;
  teamName: string;
  placement?: string;
  date: string;
}

const Certificate: React.FC<CertificateProps> = ({
  eventName,
  participantName,
  teamName,
  placement,
  date,
}) => {
  return (
    <div className="w-[1056px] h-[816px] bg-white p-16 font-serif" style={{ fontFamily: 'Garamond, serif' }}>
      {/* Border Design */}
      <div className="w-full h-full border-8 border-double border-gray-800 p-8">
        <div className="w-full h-full border border-gray-400 p-8 flex flex-col items-center justify-between">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Certificate of Achievement</h1>
            <div className="text-xl text-gray-600">This is to certify that</div>
          </div>

          {/* Content */}
          <div className="text-center space-y-8">
            <div className="text-3xl font-bold text-gray-800 italic">{participantName}</div>
            
            <div className="text-xl text-gray-600 leading-relaxed">
              has successfully participated in
              <div className="text-2xl font-bold text-gray-800 my-4">{eventName}</div>
              as a member of team
              <div className="text-2xl font-bold text-gray-800 my-4">{teamName}</div>
              {placement && (
                <div className="text-xl text-gray-800 mt-4">
                  Achieving <span className="font-bold">{placement}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="w-full flex justify-between items-end">
            <div className="text-left">
              <div className="text-gray-600">Date</div>
              <div className="text-lg font-bold text-gray-800">{date}</div>
            </div>
            <div className="text-center">
              <div className="w-48 border-t border-gray-400 pt-2">
                <div className="text-gray-800 font-bold">John Smith</div>
                <div className="text-gray-600 text-sm">Event Director</div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-48 border-t border-gray-400 pt-2">
                <div className="text-gray-800 font-bold">Sarah Johnson</div>
                <div className="text-gray-600 text-sm">Program Coordinator</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
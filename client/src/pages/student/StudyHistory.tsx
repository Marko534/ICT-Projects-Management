import React, { useState, useEffect } from 'react';
import { StudySession } from '../../types';
import { studyAPI } from '../../services/api';

const StudyHistory: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await studyAPI.getHistory();
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching study history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Study History</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No study sessions yet. Start studying to see your progress!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sessions.map(session => {
                const startTime = new Date(session.start_time);
                const endTime = session.end_time ? new Date(session.end_time) : null;
                const duration = endTime 
                  ? ((endTime.getTime() - startTime.getTime()) / 60000).toFixed(1) 
                  : 'In Progress';
                const accuracy = session.total_count > 0 
                  ? ((session.correct_count / session.total_count) * 100).toFixed(1) 
                  : '0';
                
                return (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {startTime.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {duration} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {session.score}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {accuracy}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudyHistory;
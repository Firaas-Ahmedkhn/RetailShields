const NotAuthorized = () => (
  <div
    className="flex items-center justify-center h-screen bg-gray-100"
  >
    <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200">
      <div className="text-4xl mb-4">🚫</div>
      <h1 className="text-2xl font-semibold text-red-600 mb-2">
        Access Denied
      </h1>
      <p className="text-gray-600">
        You are not authorized to view this page.
      </p>
    </div>
  </div>
);

export default NotAuthorized;

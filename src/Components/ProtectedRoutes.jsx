const ProtectedRoute = ({ allowedRoles, children }) => {
  console.log('ProtectedRoute check:', {
    isAuthenticated: !!TokenService.getToken(),
    userRole: TokenService.getUserRole(),
    loading: false,
    allowedRoles,
    // Add this to debug role matching
    roleMatch: allowedRoles.includes(TokenService.getUserRole())
  });

  const token = TokenService.getToken();
  const userRole = TokenService.getUserRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Convert both to lowercase for case-insensitive comparison
  const hasAllowedRole = allowedRoles.some(role => 
    role.toLowerCase() === userRole?.toLowerCase()
  );

  console.log('Role check details:', {
    userRole,
    allowedRoles,
    hasAllowedRole
  });

  if (!hasAllowedRole) {
    console.log('Unauthorized role, redirecting. Expected one of:', allowedRoles, 'but got:', userRole);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute; 
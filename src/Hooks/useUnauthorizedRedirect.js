import { useNavigate } from 'react-router-dom';
import usePermissions from './userPermission';

export const useUnauthorizedRedirect = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const checkPermissionAndExecute = (permission, action) => {
    if (!hasPermission(permission)) {
      navigate('/unauthorized');
      return false;
    }
    if (action) {
      action();
    }
    return true;
  };

  return { checkPermissionAndExecute };
};

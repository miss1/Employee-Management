import { useAppDispatch } from '../app/hooks.ts';
import { updateLoading } from '../app/slice/loading.ts';

const useLoading = () => {
  const dispatch = useAppDispatch();

  const showLoading = (isShow: boolean) => {
    dispatch(updateLoading(isShow));
  };

  return { showLoading };
};

export default useLoading;

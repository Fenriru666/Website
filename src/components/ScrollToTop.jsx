import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuộn lên đầu trang (tọa độ 0, 0)
    window.scrollTo(0, 0);
  }, [pathname]); // Mảng phụ thuộc là `pathname`, useEffect sẽ chạy lại mỗi khi URL thay đổi

  return null; // Component này không hiển thị bất cứ thứ gì trên giao diện
}

export default ScrollToTop;
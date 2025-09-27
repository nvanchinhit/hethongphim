import React from 'react';

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">FAQ & Liên hệ</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-3">WebPhim là gì?</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                WebPhim là website xem phim trực tuyến miễn phí, cập nhật nhanh các bộ phim mới với chất lượng cao và giao diện thân thiện. 
                Chúng tôi cam kết mang đến trải nghiệm xem phim tốt nhất cho người dùng.
              </p>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-3">Tại sao chọn WebPhim?</h2>
              <ul className="text-gray-300 text-sm leading-relaxed space-y-2">
                <li>• Hoàn toàn miễn phí, không có quảng cáo làm phiền</li>
                <li>• Cập nhật phim mới nhanh chóng</li>
                <li>• Chất lượng video cao, giao diện đẹp mắt</li>
                <li>• Hỗ trợ đa nền tảng (máy tính, điện thoại, tablet)</li>
                <li>• Không yêu cầu đăng ký tài khoản</li>
              </ul>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-3">Nguồn phim ở đâu?</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Nội dung được tổng hợp từ nhiều nguồn công khai trên Internet. Nếu có vấn đề bản quyền, vui lòng liên hệ để chúng tôi xử lý ngay lập tức.
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-3">Có quảng cáo không?</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                WebPhim cam kết không có quảng cáo popup, banner hay video quảng cáo làm phiền người dùng. 
                Chúng tôi tập trung vào trải nghiệm xem phim thuần túy và chất lượng.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-3">Thông tin Developer</h2>
              <div className="text-gray-300 text-sm space-y-3">
                <p><strong className="text-cyan-400">Developer:</strong> Nguyễn Văn Chính</p>
                <p><strong className="text-cyan-400">Chuyên môn:</strong> Full-stack Web Development</p>
                <p><strong className="text-cyan-400">Công nghệ:</strong> Next.js, React, TypeScript, Tailwind CSS</p>
                <p className="text-xs text-gray-400 mt-4">
                  Website được phát triển với mục đích học tập và chia sẻ kiến thức. 
                  Mọi phản hồi và góp ý đều được đánh giá cao.
                </p>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-3">Liên hệ hỗ trợ</h2>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>Email: <a href="mailto:nguyenvchinh.dev@gmail.com" className="text-cyan-400 hover:text-cyan-300">nguyenvchinh.dev@gmail.com</a></li>
                <li>GitHub: <a href="https://github.com/nguyenvchinh" className="text-cyan-400 hover:text-cyan-300" target="_blank" rel="noopener noreferrer">github.com/nguyenvchinh</a></li>
                <li>LinkedIn: <a href="https://linkedin.com/in/nguyenvchinh" className="text-cyan-400 hover:text-cyan-300" target="_blank" rel="noopener noreferrer">linkedin.com/in/nguyenvchinh</a></li>
              </ul>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-3">Cam kết chất lượng</h2>
              <p className="text-gray-300 text-xs leading-relaxed">
                WebPhim được phát triển với tiêu chí đặt người dùng lên hàng đầu. 
                Chúng tôi cam kết cung cấp dịch vụ ổn định, giao diện thân thiện và trải nghiệm xem phim tuyệt vời.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

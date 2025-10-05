import React from 'react';

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">FAQ & Liên hệ</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-3">
            <details className="group bg-slate-800 rounded-lg p-5 open:pb-6 transition-all">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <h2 className="text-base md:text-lg font-semibold text-white">WebPhim là gì?</h2>
                <svg className="w-4 h-4 text-cyan-300 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5H7z"/></svg>
              </summary>
              <div className="mt-3 text-gray-300 text-sm leading-relaxed">
                WebPhim là website xem phim trực tuyến miễn phí, cập nhật nhanh các bộ phim mới với chất lượng cao và giao diện thân thiện.
                Chúng tôi cam kết mang đến trải nghiệm xem phim tốt nhất cho người dùng.
              </div>
            </details>

            <details className="group bg-slate-800 rounded-lg p-5 open:pb-6 transition-all">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <h2 className="text-base md:text-lg font-semibold text-white">Tại sao chọn WebPhim?</h2>
                <svg className="w-4 h-4 text-cyan-300 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5H7z"/></svg>
              </summary>
              <ul className="mt-3 text-gray-300 text-sm leading-relaxed space-y-2">
                <li>• Hoàn toàn miễn phí, không có quảng cáo làm phiền</li>
                <li>• Cập nhật phim mới nhanh chóng</li>
                <li>• Chất lượng video cao, giao diện đẹp mắt</li>
                <li>• Hỗ trợ đa nền tảng (máy tính, điện thoại, tablet)</li>
                <li>• Không yêu cầu đăng ký tài khoản</li>
              </ul>
            </details>

            <details className="group bg-slate-800 rounded-lg p-5 open:pb-6 transition-all">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <h2 className="text-base md:text-lg font-semibold text-white">Nguồn phim ở đâu?</h2>
                <svg className="w-4 h-4 text-cyan-300 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5H7z"/></svg>
              </summary>
              <div className="mt-3 text-gray-300 text-sm leading-relaxed">
                Nội dung được tổng hợp từ nhiều nguồn công khai trên Internet. Nếu có vấn đề bản quyền, vui lòng liên hệ để chúng tôi xử lý ngay lập tức.
              </div>
            </details>

            <details className="group bg-slate-800 rounded-lg p-5 open:pb-6 transition-all">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <h2 className="text-base md:text-lg font-semibold text-white">Có quảng cáo không?</h2>
                <svg className="w-4 h-4 text-cyan-300 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5H7z"/></svg>
              </summary>
              <div className="mt-3 text-gray-300 text-sm leading-relaxed">
                WebPhim cam kết không có quảng cáo popup, banner hay video quảng cáo liên quan tới vi phạm pháp luật làm phiền người dùng.
                Chúng tôi tập trung vào trải nghiệm xem phim thuần túy và chất lượng.
                Nếu bạn thấy quảng cáo liên quan thì do bên thứ 3 gắn vào vui lòng báo cho chúng tôi để gỡ bỏ.
              </div>
            </details>

            <details className="group bg-slate-800 rounded-lg p-5 open:pb-6 transition-all">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <h2 className="text-base md:text-lg font-semibold text-white">Ủng hộ website</h2>
                <svg className="w-4 h-4 text-cyan-300 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5H7z"/></svg>
              </summary>
              <div className="mt-3 text-gray-300 text-sm leading-relaxed space-y-3">
                <p>Sự ủng hộ của bạn là động lực để chúng tôi phát triển website lớn mạnh hơn.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p><span className="text-cyan-400">Ngân hàng:</span> Á Châu Bank</p>
                    <p><span className="text-cyan-400">Số tài khoản:</span> 200546</p>
                    <p><span className="text-cyan-400">Chủ TK:</span> NGUYEN VAN CHINH</p>
                    <p className="text-xs text-gray-400">Nội dung chuyển khoản: &quot;Ung ho WebPhim&quot;</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <img src="https://qr.sepay.vn/img?bank=ACB&acc=200546&template=compact&amount=&des=" alt="QR Ủng hộ" className="w-40 h-40 rounded bg-slate-700 object-contain" />
                  </div>
                </div>
              </div>
            </details>
          </div>
          
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-3">Thông tin Developer</h2>
              <div className="text-gray-300 text-sm space-y-3">
                <p><strong className="text-cyan-400">Developer:</strong> Nguyễn Văn Chính</p>
                <p><strong className="text-cyan-400">Chuyên môn:</strong> Frontend Developer</p>
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
                <li>Email: <a href="mailto:chinhnvpd10204@gmail.com" className="text-cyan-400 hover:text-cyan-300">chinhnvpd10204@gmail.com</a></li>
                <li>GitHub: <a href="https://github.com/nvanchinhit" className="text-cyan-400 hover:text-cyan-300" target="_blank" rel="noopener noreferrer">github.com/nvanchinhit</a></li>
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

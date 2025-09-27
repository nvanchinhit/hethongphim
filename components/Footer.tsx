import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4 group" suppressHydrationWarning>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  WebPhim
                </span>
                <span className="text-xs text-gray-500">Cinema Online</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Trang web xem phim online miễn phí chất lượng cao, cập nhật phim mới nhất từ Việt Nam và quốc tế. 
              Trải nghiệm xem phim tuyệt vời với giao diện thân thiện và tốc độ tải nhanh.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.488-1.995.702 0 1.041.219 1.041 1.219 0 .738-.469 1.844-.711 2.868-.203.859.428 1.56 1.269 1.56 1.523 0 2.697-1.609 2.697-3.927 0-2.055-1.474-3.489-3.585-3.489-2.442 0-3.877 1.833-3.877 3.727 0 .738.284 1.529.639 1.955a.203.203 0 01.047.197c-.051.219-.165.661-.188.756-.03.125-.097.152-.224.091-1.25-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.969-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm" suppressHydrationWarning>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/danh-muc/phim-moi" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm" suppressHydrationWarning>
                  Phim mới
                </Link>
              </li>
              <li>
                <Link href="/danh-muc/phim-hay" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm" suppressHydrationWarning>
                  Phim hay
                </Link>
              </li>
              <li>
                <Link href="/danh-muc/phim-le" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm" suppressHydrationWarning>
                  Phim lẻ
                </Link>
              </li>
              <li>
                <Link href="/danh-muc/phim-bo" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm" suppressHydrationWarning>
                  Phim bộ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Thể loại</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/danh-muc/hanh-dong" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm" suppressHydrationWarning>
                  Hành động
                </Link>
              </li>
              <li>
                <Link href="/danh-muc/tinh-cam" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm" suppressHydrationWarning>
                  Tình cảm
                </Link>
              </li>
              <li>
                <Link href="/danh-muc/hai-huoc" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm" suppressHydrationWarning>
                  Hài hước
                </Link>
              </li>
              <li>
                <Link href="/danh-muc/kinh-di" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm" suppressHydrationWarning>
                  Kinh dị
                </Link>
              </li>
              <li>
                <Link href="/danh-muc/khoa-hoc-vien-tuong" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm" suppressHydrationWarning>
                  Khoa học viễn tưởng
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 iamvanchinh. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm" suppressHydrationWarning>
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm" suppressHydrationWarning>
                Điều khoản sử dụng
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm" suppressHydrationWarning>
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

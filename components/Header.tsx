'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60); // cuộn xuống thì đổi nền
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const menuItems = [
    {
      title: 'Thể loại',
      items: [
        { name: 'Hành Động', slug: 'hanh-dong' },
        { name: 'Hài', slug: 'hai' },
        { name: 'Chính Kịch', slug: 'chinh-kich' },
        { name: 'Lịch Sử', slug: 'lich-su' },
        { name: 'Bí Ẩn', slug: 'bi-an' },
        { name: 'Gây Cấn', slug: 'gay-can' },
        { name: 'Tình Cảm', slug: 'tinh-cam' },
        { name: 'Phim 18+', slug: 'phim-18' },
        { name: 'Phiêu Lưu', slug: 'phieu-luu' },
        { name: 'Hình Sự', slug: 'hinh-su' },
        { name: 'Gia Đình', slug: 'gia-dinh' },
        { name: 'Kinh Dị', slug: 'kinh-di' },
        { name: 'Lãng Mạn', slug: 'lang-man' },
        { name: 'Chiến Tranh', slug: 'chien-tranh' },
        { name: 'Cổ Trang', slug: 'co-trang' },
        { name: 'Hoạt Hình', slug: 'hoat-hinh' },
        { name: 'Tài Liệu', slug: 'tai-lieu' },
        { name: 'Giả Tưởng', slug: 'gia-tuong' },
        { name: 'Nhạc', slug: 'nhac' },
        { name: 'Khoa Học Viễn Tưởng', slug: 'khoa-hoc-vien-tuong' },
        { name: 'Tâm Lý', slug: 'tam-ly' },
        { name: 'Miền Tây', slug: 'mien-tay' },
      ],
    },
    {
      title: 'Quốc gia',
      items: [
        { name: 'Âu Mỹ', slug: 'au-my' },
        { name: 'Indonesia', slug: 'indonesia' },
        { name: 'Hồng Kông', slug: 'hong-kong' },
        { name: 'Thái Lan', slug: 'thai-lan' },
        { name: 'Hà Lan', slug: 'ha-lan' },
        { name: 'Quốc gia khác', slug: 'quoc-gia-khac' },
        { name: 'Anh', slug: 'anh' },
        { name: 'Việt Nam', slug: 'viet-nam' },
        { name: 'Hàn Quốc', slug: 'han-quoc' },
        { name: 'Đài Loan', slug: 'dai-loan' },
        { name: 'Philippines', slug: 'philippines' },
        { name: 'Trung Quốc', slug: 'trung-quoc' },
        { name: 'Pháp', slug: 'phap' },
        { name: 'Nhật Bản', slug: 'nhat-ban' },
        { name: 'Nga', slug: 'nga' },
        { name: 'Ấn Độ', slug: 'an-do' },
      ],
    },
    {
      title: 'Năm',
      items: Array.from({ length: 22 }, (_, i) => 2025 - i).map(year => ({
        name: year.toString(),
        slug: year.toString()
      })),
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" suppressHydrationWarning>
            <Image src="https://cdn.worldvectorlogo.com/logos/c-1.svg" alt="Logo" width={40} height={40} />
            <span className="text-white font-bold tracking-wide text-lg hidden sm:block">
              PHIMCHILL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-white font-medium">
            <Link href="/" className="hover:text-cyan-400" suppressHydrationWarning>Đề Xuất</Link>
            <Link href="/danh-muc/tv-shows" className="hover:text-cyan-400" suppressHydrationWarning>TV Shows</Link>
            <Link href="/danh-muc/phim-le" className="hover:text-cyan-400" suppressHydrationWarning>Phim Lẻ</Link>
            <Link href="/danh-muc/phim-bo" className="hover:text-cyan-400" suppressHydrationWarning>Phim Bộ</Link>
            <Link href="/danh-muc/phim-dang-chieu" className="hover:text-cyan-400" suppressHydrationWarning>Phim đang chiếu</Link>

            {menuItems.map((menu) => (
              <div key={menu.title} className="relative group">
                <button className="flex items-center gap-1 hover:text-cyan-400">
                  <span>{menu.title}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-96 bg-slate-900/95 backdrop-blur rounded-xl shadow-2xl border border-slate-700/70 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="grid grid-cols-3 gap-1 p-4 max-h-80 overflow-y-auto">
                    {menu.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/danh-muc/${item.slug}`}
                        suppressHydrationWarning
                        className="px-2 py-1.5 rounded text-xs text-gray-300 hover:text-cyan-400 hover:bg-white/10 transition-colors text-center truncate"
                        title={item.name}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Search + Mobile Menu */}
          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="hidden lg:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm phim..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-72 px-4 py-2 pl-10 bg-black/40 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:border-cyan-400"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </form>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white hover:text-cyan-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-700 bg-black/90 backdrop-blur-md">
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="sm:hidden">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm phim..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-black/50 border border-slate-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </form>

              <nav className="grid grid-cols-2 gap-3 text-white">
                <Link href="/" className="hover:text-cyan-400" suppressHydrationWarning>Đề Xuất</Link>
                <Link href="/danh-muc/tv-shows" className="hover:text-cyan-400" suppressHydrationWarning>TV Shows</Link>
                <Link href="/danh-muc/phim-le" className="hover:text-cyan-400" suppressHydrationWarning>Phim Lẻ</Link>
                <Link href="/danh-muc/phim-bo" className="hover:text-cyan-400" suppressHydrationWarning>Phim Bộ</Link>
                <Link href="/danh-muc/phim-dang-chieu" className="hover:text-cyan-400" suppressHydrationWarning>Đang chiếu</Link>
              </nav>

              {menuItems.map((menu) => (
                <div key={menu.title}>
                  <h3 className="text-cyan-400 font-semibold mb-2">{menu.title}</h3>
                  <div className="grid grid-cols-2 gap-2 ml-4">
                    {menu.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/danh-muc/${item.slug}`}
                        suppressHydrationWarning
                        className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-bold text-white tracking-tight">
              Tech<span className="text-indigo-400">Store</span>
            </span>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Premium consumer electronics, mechanical keyboards, audio accessories, and ergonomic desktop setups modeled for developer productivity.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Shop Pages</h4>
            <ul className="space-y-2 text-sm">
              <li><Link id="footer-link-shopall" to="/products" className="hover:text-white transition">Product Catalog</Link></li>
              <li><Link id="footer-link-hot" to="/products" className="hover:text-white transition">Featured Hot Deals</Link></li>
              <li><Link id="footer-link-new" to="/products" className="hover:text-white transition">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Customer Support</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-slate-400">Hotline: 1900-STORE</span></li>
              <li><span className="text-slate-400">Mail: support@store.com</span></li>
              <li><span className="text-slate-400">Policy: 30-Day Safe Returns</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">System Integration</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              This application is configured with a fully operational Express local data synchronization environment, enabling live mock testing across storefront operations.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between">
          <p>&copy; {new Date().getFullYear()} TechStore E-Commerce Inc. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0 font-mono text-[10px]">
            <span>SYSTEM STATUS: <span className="text-emerald-500">LIVE</span></span>
            <span>API SERVER: <span className="text-indigo-400">MOCK-DB (PORT 3000)</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;

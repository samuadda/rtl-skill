/**
 * RTL SKILL TEST COMPONENT
 * 
 * This component is INTENTIONALLY BROKEN for RTL.
 * It contains every common mistake an agent might make.
 * 
 * Use this to test the rtl skill:
 *   1. Run /rtl-audit on this file
 *   2. Run /rtl-convert on this file
 *   3. Check the output against the expected fixes below
 * 
 * SCORE: Agent should catch and fix all 24 issues.
 */

import { 
  ChevronRight, 
  ArrowLeft, 
  Send,
  Heart,
  Star,
  Search,
  Bell,
  Settings
} from 'lucide-react'

// ❌ ISSUE 1: No dir="rtl" on root wrapper

export function BadDashboard() {
  return (
    // ❌ ISSUE 2: No dir attribute on container
    <div style={{ fontFamily: 'Arial, sans-serif' }}> {/* ❌ ISSUE 3: Non-Arabic font */}

      {/* ===== NAVBAR ===== */}
      <nav style={{
        display: 'flex',
        flexDirection: 'row',          // ❌ ISSUE 4: No RTL consideration for flex row
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid #eee',
      }}>
        {/* Logo — left side in LTR, should be RIGHT side in RTL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.svg" alt="Logo" />
          <span>My App</span>
        </div>

        {/* Nav actions */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Search size={20} />     {/* ✅ Neutral icon — should NOT flip */}
          <Bell size={20} />       {/* ✅ Neutral icon — should NOT flip */}
          <Settings size={20} />   {/* ✅ Neutral icon — should NOT flip */}
        </div>
      </nav>

      {/* ===== BREADCRUMBS ===== */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '12px 24px',        // ❌ ISSUE 5: Physical padding (should be inline)
        marginLeft: 0,               // ❌ ISSUE 6: marginLeft
      }}>
        <span>Home</span>
        <ChevronRight size={16} />   {/* ❌ ISSUE 7: Directional icon not flipped */}
        <span>Products</span>
        <ChevronRight size={16} />   {/* ❌ ISSUE 8: Same — directional, must flip */}
        <span style={{ fontWeight: 600 }}>Item Detail</span>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ display: 'flex', flexDirection: 'row' }}> {/* ❌ ISSUE 9: flex row without RTL */}

        {/* SIDEBAR */}
        <aside style={{
          width: 260,
          borderRight: '1px solid #eee',  // ❌ ISSUE 10: borderRight (should be border-inline-end)
          padding: '24px 16px',
          position: 'sticky',
          left: 0,                         // ❌ ISSUE 11: left (should be inset-inline-start)
          top: 0,
        }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['الرئيسية', 'المنتجات', 'الطلبات', 'الإعدادات'].map((item) => (
              <li key={item} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                marginBottom: 4,
                borderRadius: 8,
                cursor: 'pointer',
              }}>
                <ChevronRight size={14} /> {/* ❌ ISSUE 12: Directional icon not flipped */}
                <span style={{
                  letterSpacing: '0.5px',  // ❌ ISSUE 13: letter-spacing on Arabic text — must be 0
                  lineHeight: 1.2,         // ❌ ISSUE 14: lineHeight too tight for Arabic
                }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        {/* MAIN PANEL */}
        <main style={{
          flex: 1,
          padding: 24,
          marginLeft: 260,             // ❌ ISSUE 15: marginLeft (should be margin-inline-start)
        }}>

          {/* STATS ROW */}
          <div style={{
            display: 'flex',
            gap: 16,
            marginBottom: 24,
          }}>
            {[
              { label: 'إجمالي المبيعات', value: '24,500' },
              { label: 'الطلبات', value: '1,234' },
              { label: 'العملاء', value: '856' },
            ].map((stat) => (
              <div key={stat.label} style={{
                flex: 1,
                padding: 20,
                borderRadius: 12,
                border: '1px solid #eee',
                textAlign: 'left',       // ❌ ISSUE 16: textAlign left (should be start)
              }}>
                <div style={{
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: '-0.5px', // ❌ ISSUE 17: letter-spacing on what may render as Arabic
                }}>
                  {stat.value}             {/* ✅ This is a number — should stay LTR */}
                </div>
                <div style={{ color: '#666', marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* PRODUCT CARD */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',        // ❌ ISSUE 18: flex row without RTL handling
            gap: 16,
            padding: 20,
            borderRadius: 12,
            border: '1px solid #eee',
            marginBottom: 16,
          }}>
            <img
              src="/product.jpg"
              alt="Product"
              style={{ width: 80, height: 80, borderRadius: 8, float: 'left' }} // ❌ ISSUE 19: float left
            />

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px', textAlign: 'right' }}> {/* ❌ ISSUE 20: textAlign right (should be end) */}
                اسم المنتج
              </h3>
              <p style={{ margin: 0, color: '#666', textAlign: 'right' }}> {/* ❌ ISSUE 21: same */}
                وصف المنتج هنا
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Heart size={16} />      {/* ✅ Neutral — should NOT flip */}
                <Star size={16} />       {/* ✅ Neutral — should NOT flip */}
              </div>

              {/* CTA button with directional icon */}
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                paddingLeft: 12,         // ❌ ISSUE 22: paddingLeft (should be padding-inline-start)
                borderRadius: 8,
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}>
                إضافة للسلة
                <Send size={14} />       {/* ❌ ISSUE 23: Send icon is directional — must flip */}
              </button>
            </div>
          </div>

          {/* PROGRESS / STEPPER */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>تقدم الطلب</span>
              <span style={{ direction: 'ltr' }}>75%</span> {/* ✅ Percentage in LTR */}
            </div>
            <div style={{
              height: 8,
              backgroundColor: '#eee',
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: '75%',
                backgroundColor: '#0070f3',
                borderRadius: 4,
                // ❌ ISSUE 24: No RTL consideration — fills from left always
                // Should fill from inline-start (right in RTL)
                marginLeft: 0,
              }} />
            </div>
          </div>

          {/* CONTACT INFO — numbers that must stay LTR */}
          <div style={{ padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
            <p style={{ margin: '0 0 8px' }}>
              {/* ❌ MISSING: phone number not wrapped in LTR island */}
              رقم الجوال: +966 50 000 0000
            </p>
            <p style={{ margin: '0 0 8px' }}>
              {/* ❌ MISSING: email not wrapped in LTR island */}
              البريد: user@example.com
            </p>
            <p style={{ margin: 0 }}>
              {/* ❌ MISSING: URL not wrapped in LTR island */}
              الموقع: https://example.com
            </p>
          </div>

        </main>
      </div>

      {/* ===== PAGINATION ===== */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        padding: 24,
      }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowLeft size={16} />  {/* ❌ This is "previous" — in RTL should point RIGHT */}
          السابق
        </button>

        {[1, 2, 3, 4, 5].map(n => (
          <button key={n}>{n}</button>  {/* ✅ Numbers stay as-is */}
        ))}

        <button style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          التالي
          <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} /> {/* ❌ Hardcoded rotation — fragile in RTL */}
        </button>
      </div>

    </div>
  )
}
```

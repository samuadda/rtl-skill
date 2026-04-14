<div align="center">

<img src="assets/logo.svg" alt="شعار rtl-skill" width="420"/>

# rtl-skill

![النجوم](https://img.shields.io/github/stars/samuadda/rtl-skill?style=flat&color=orange)
![آخر تحديث](https://img.shields.io/github/last-commit/samuadda/rtl-skill?style=flat&color=green)
![الرخصة](https://img.shields.io/github/license/samuadda/rtl-skill?style=flat&color=yellow)
![npm](https://img.shields.io/badge/install-npx%20skills%20add-blue?style=flat)

**واجهة مستخدم عربية من اليمين إلى اليسار — تثبيت واحد، لكل وكيل.**

مهارة لوكلاء الذكاء الاصطناعي تجعل دعم تخطيط RTL العربي تلقائياً. تغطي انعكاس التخطيط، الخصائص المنطقية في CSS، الطباعة العربية، المكونات الاتجاهية، الأيقونات، الرسوم المتحركة، والنماذج.

</div>

---

<div dir="rtl">

## التثبيت

```bash
# اكتشاف الوكيل تلقائياً
npx skills add samuadda/rtl-skill

# وكلاء محددون
npx skills add samuadda/rtl-skill -a claude-code
npx skills add samuadda/rtl-skill -a cursor
npx skills add samuadda/rtl-skill -a windsurf
npx skills add samuadda/rtl-skill -a cline
npx skills add samuadda/rtl-skill -a copilot

# عالمي (جميع المشاريع)
npx skills add samuadda/rtl-skill -g
```

---

## الأوامر

| الأمر | ما يفعله |
|-------|----------|
| `/rtl-init` | إنشاء مشروع جديد مع دعم RTL مدمج — الخطوط، الإعادة، الإعداد، المكونات الأساسية |
| `/rtl-audit` | فحص قاعدة الكود الحالية لمشاكل RTL ← ينتج `rtl-audit-report.md` |
| `/rtl-convert <file>` | تحويل مكون محدد ليدعم RTL |
| `/rtl-check` | فحص سريع بالقائمة الذهبية على المكون الحالي |

تعمل جميع الأوامر أيضاً باللغة الطبيعية: "افحص هذا المشروع لمشاكل RTL"، "حوّل هذا المكون لـ RTL"، وما إلى ذلك.

---

## ما يغطيه

- ✅ الخصائص المنطقية في CSS (`inline-start/end` بدلاً من `left/right`)
- ✅ الطباعة العربية (خطوط Cairo/Tajawal، `letter-spacing: 0`، `line-height` سخي)
- ✅ تصنيف الأيقونات (اتجاهية مقابل محايدة — يعرف ما يجب قلبه)
- ✅ أنماط المكونات (مسارات التنقل، الترقيم، الأدراج، التنبيهات، العروض الدوارة)
- ✅ الرسوم المتحركة (اتجاهات الانزلاق، مؤشرات التقدم، محملات الهيكل)
- ✅ النماذج (محاذاة الإدخال، التسميات، التحقق، إدخالات الأرقام)
- ✅ البيانات والجداول (ترتيب الأعمدة، مؤشرات الفرز)
- ✅ جزر LTR (الأرقام، الروابط، الكود داخل النص العربي)
- ✅ هيكل التبديل الديناميكي بين LTR وRTL

## دعم الأطر البرمجية

- Tailwind CSS (متغيرات `rtl:`، أدوات الخصائص المنطقية `s`/`e`)
- CSS / SCSS عادي (الخصائص المنطقية، mixins في SCSS)
- CSS-in-JS (styled-components، emotion)
- React Native (`I18nManager`، Animated API)

---

## النموذج الذهني الأساسي

قبل إنشاء أي مكون، يُجري الوكيل **اختبار محور البداية/النهاية**:

> "هل لهذا العنصر بداية ونهاية؟ إذا نعم — فهو يحتاج إلى قرار RTL واعٍ."

كل عنصر يقع في إحدى ثلاث فئات:
- **دائماً انعكاس** — التخطيط، flex، الأيقونات الاتجاهية، الرسوم المتحركة
- **لا انعكاس أبداً** — الأرقام، الكود، الروابط، الأيقونات المحايدة
- **حسب السياق** — الصور، الرسوم التوضيحية

---

## اختبار المهارة

يتحقق إطار الاختبار من قدرة المهارة على اكتشاف المشاكل بشكل صحيح. يُشغّل `/rtl-audit` على مكون معطوب عمداً ويفشل إذا اكتُشف أقل من 22/24 مشكلة.

```bash
npm install
ANTHROPIC_API_KEY=sk-... npm test
```

المكون (`test/BadComponent.jsx`) يحتوي على 24 خطأ RTL متعمد. المخرجات المتوقعة: 16 مشكلة حرجة + 5 متدهورة + 3 تجميلية، مع تصنيف صحيح للأيقونات (5 اتجاهية مقلوبة، 5 محايدة غير مقلوبة). دليل التصحيح الكامل: [`test/ANSWER_KEY.md`](test/ANSWER_KEY.md).

---

## المساهمة

راجع [CONTRIBUTING.md](CONTRIBUTING.md) للاطلاع على كيفية إصلاح القواعد، إضافة أطر عمل، وتقديم طلبات الدمج.

القاعدة الأساسية: **يجب أن يبقى `reference.md` و`workflows.md` متزامنين** — إذا أضفت قاعدة لأحدهما، حدّث الآخر.

---

## الرخصة

MIT

</div>

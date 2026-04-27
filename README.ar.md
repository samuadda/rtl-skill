<div align="center" dir="rtl">

<img src="assets/logo.svg" alt="rtl-skill" width="480"/>

<br/>

[![Stars](https://img.shields.io/github/stars/samuadda/rtl-skill?style=for-the-badge&color=252525&labelColor=151515)](https://github.com/samuadda/rtl-skill/stargazers)
[![License](https://img.shields.io/github/license/samuadda/rtl-skill?style=for-the-badge&color=252525&labelColor=151515)](https://github.com/samuadda/rtl-skill/blob/main/LICENSE)
[![NPM Install](https://img.shields.io/badge/install-npx%20skills%20add-3b82f6?style=for-the-badge&labelColor=151515)](https://npmjs.com/package/rtl-skill)

**المعيار النخبوي لهندسة واجهات اليمين إلى اليسار (RTL) في وكلاء الذكاء الاصطناعي**

[Read in English](README.md)

</div>

<br/>

<div dir="rtl">

تُزوّد مهارة `rtl-skill` وكلاء الذكاء الاصطناعي البرمجية بفهم أصيل وعميق لهيكلة واجهات المستخدم العربية (RTL). وتضمن تنفيذاً آلياً وخالياً من العيوب للخصائص المنطقية (Logical Properties)، الطباعة العربية، الأيقونات الاتجاهية، والرسوم المتحركة المنعكسة.

---

## التثبيت

### المسار الموصى به

```bash
# اكتشاف وكيلك النشط والتثبيت التلقائي
npx skills add samuadda/rtl-skill

# تحديد وكيل معين
npx skills add samuadda/rtl-skill -a claude-code

# التثبيت الشامل لجميع المشاريع
npx skills add samuadda/rtl-skill -g
```

### التكامل اليدوي

للبيئات المؤسسية أو الوكلاء غير المدرجين، قم باستنساخ المهارة مباشرة إلى دليل المهارات الخاص بوكيلك:

```bash
git clone --depth 1 https://github.com/samuadda/rtl-skill.git /tmp/rtl-skill

# Claude Code
cp -R /tmp/rtl-skill/skills/rtl ~/.claude/skills/

# Antigravity
cp -R /tmp/rtl-skill/skills/rtl ~/.gemini/antigravity/skills/
```

---

## القدرات

تؤسس المهارة نموذجاً ذهنياً صارماً يعتمد على "محور البداية/النهاية". وتتعامل باحترافية مع:

- **CSS المنطقي**: فرض استخدام `inline-start/end` بدلاً من `left/right` التقليدية.
- **الطباعة العربية**: تحسين `line-height` وتصفير `letter-spacing` ليتناسب مع خطوط مثل Cairo و Tajawal.
- **السياق الاتجاهي**: قلب الأيقونات الاتجاهية بذكاء مع الحفاظ على الأيقونات المحايدة كما هي.
- **التفاعلات الدقيقة**: عكس اتجاه الانزلاق، أشرطة التقدم، ومحملات الهيكل (Skeleton Loaders).
- **النماذج والجداول**: محاذاة دقيقة للمدخلات، تدفقات التحقق من صحة النماذج، وترتيب الأعمدة.
- **جزر LTR**: تعامل مثالي مع الأرقام، الروابط، وكتل الأكواد البرمجية داخل النص العربي.

## الأوامر

| الأمر | الإجراء |
|-------|---------|
| `/rtl-init` | بناء أساس قوي وجاهز للإنتاج لدعم RTL (الخطوط، الإعادة، الإعدادات الأساسية). |
| `/rtl-audit` | تحليل قاعدة الكود الحالية وإنشاء تقرير `rtl-audit-report.md`. |
| `/rtl-convert <file>` | إعادة هيكلة مكون محدد ليتوافق تماماً مع معايير RTL. |
| `/rtl-check` | إجراء تحقق سريع وشامل للمكون النشط لضمان تطبيق القواعد الذهبية. |

*تستجيب هذه الأوامر أيضاً للتوجيهات باللغة الطبيعية (مثل: "قم بفحص هذا المشروع لمشاكل RTL").*

---

## الموثوقية المؤسسية

تم اختبار `rtl-skill` تحت الضغط مقابل مكتبات مكونات واجهة المستخدم الرائدة.

في اختبار الضغط الخاص بنا على سجل `shadcn-ui`، تمكنت المهارة من تحديد وإصلاح **22 تراجعاً هيكلياً مختلفاً في RTL** عبر 56 مكوناً، محققة نسبة نجاح 100% في حزمة التقييم المكونة من 30 استعلاماً.

للاطلاع على المعايير التفصيلية، يمكنك مراجعة [التدقيق الواقعي](tests/real-world-audit.md) و [نتائج التقييم](evals/results.md).

---

## الاستثناءات

تركز هذه الهيكلة حصرياً على **واجهات المستخدم العربية**. وتستثني عمداً:
- اللغات الأخرى التي تُكتب من اليمين إلى اليسار (والتي تتطلب معالجة طباعية مختلفة).
- الرسومات الإلزامية مثل Canvas/WebGL.
- تصورات البيانات المعقدة (مثل خرائط D3).
- ترجمة المحتوى (هذه أداة للتخطيط والهيكلة، وليست واجهة برمجة تطبيقات للترجمة).

عند مواجهة هذه المجالات، يتم توجيه الوكيل للتصعيد لطلب قرارات هيكلية بشرية.

---

<div align="center">
  تم الإصدار بموجب <a href="LICENSE">رخصة MIT</a>.
</div>

</div>

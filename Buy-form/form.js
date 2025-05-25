console.log('Welcome to Trendora!');
document.addEventListener('DOMContentLoaded', function() {
    // أنيميشن جليتش للوجو TRENDORA
    const header = document.querySelector('.header.glitch');
    if(header) {
        header.setAttribute('data-text', header.textContent);
    }
    // أنيميشن شعار Trendora
    if(header) {
        let text = header.textContent.trim();
        header.innerHTML = '';
        for(let i=0; i<text.length; i++) {
            let span = document.createElement('span');
            span.textContent = text[i];
            span.style.animationDelay = (i*0.07) + 's';
            header.appendChild(span);
        }
    }
    // تأثير ظهور تدريجي للحقول (labels, inputs, selects, textarea, button)
    const fields = document.querySelectorAll('.container label, .container input, .container textarea, .container select, .container button');
    fields.forEach((el, i) => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        setTimeout(() => {
            el.style.transition = 'all 0.7s cubic-bezier(.23,1.01,.32,1)';
            el.style.opacity = 1;
            el.style.transform = 'translateY(0)';
        }, 400 + i*120);
    });
    // تأثير رسالة النتيجة
    const result = document.getElementById('result');
    if(result) {
        const observer = new MutationObserver(() => {
            result.style.color = '#22c55e';
            result.style.fontWeight = 'bold';
            result.style.transform = 'scale(1.08)';
            setTimeout(() => {
                result.style.color = '#0ea5e9';
                result.style.fontWeight = 'normal';
                result.style.transform = 'scale(1)';
            }, 1200);
        });
        observer.observe(result, { childList: true });
    }
    // أنيميشن فقاعات إضافية للخلفية
    const bgAnim = document.querySelector('.bg-anim');
    if(bgAnim) {
        for(let i=11; i<=20; i++) {
            let span = document.createElement('span');
            span.style.left = Math.random()*90 + 'vw';
            span.style.top = Math.random()*90 + 'vh';
            span.style.animationDelay = (Math.random()*8).toFixed(2) + 's';
            span.style.width = (40 + Math.random()*60) + 'px';
            span.style.height = span.style.width;
            bgAnim.appendChild(span);
        }
    }
    // أنيميشن اهتزاز للزر عند المرور
    const btn = document.querySelector('button[type="submit"]');
    if(btn) {
        btn.addEventListener('mouseenter', () => {
            btn.animate([
                { transform: 'scale(1) rotate(0deg)' },
                { transform: 'scale(1.08) rotate(-2deg)' },
                { transform: 'scale(1.05) rotate(2deg)' },
                { transform: 'scale(1) rotate(0deg)' }
            ], {
                duration: 400,
                iterations: 1
            });
        });
    }
    // أنيميشن موجة خفيفة على العنوان عند الضغط
    if(header) {
        header.addEventListener('click', () => {
            header.animate([
                { letterSpacing: '2px', color: '#fff' },
                { letterSpacing: '8px', color: '#0ea5e9' },
                { letterSpacing: '2px', color: '#fff' }
            ], {
                duration: 600,
                iterations: 1
            });
        });
    }
    // تحديث المدن تلقائياً حسب المحافظة
    const governorateCities = {
        "القاهرة": ["مدينة نصر", "مصر الجديدة", "المعادي", "حلوان", "شبرا", "الزمالك", "مدينة بدر", "التجمع"],
        "الجيزة": ["الدقي", "العجوزة", "الهرم", "6 أكتوبر", "الشيخ زايد", "البدرشين", "العياط"],
        "الإسكندرية": ["سيدي جابر", "محطة الرمل", "العصافرة", "العجمي", "برج العرب", "المنتزه"],
        "الدقهلية": ["المنصورة", "طلخا", "ميت غمر", "دكرنس", "منية النصر", "الجمالية"],
        "البحر الأحمر": ["الغردقة", "سفاجا", "القصير", "رأس غارب", "مرسى علم"],
        "البحيرة": ["دمنهور", "كفر الدوار", "إيتاي البارود", "رشيد", "أبو حمص"],
        "الفيوم": ["الفيوم", "سنورس", "إطسا", "طامية", "يوسف الصديق"],
        "الغربية": ["طنطا", "المحلة الكبرى", "زفتى", "كفر الزيات", "سمنود"],
        "الإسماعيلية": ["الإسماعيلية", "فايد", "القنطرة شرق", "القنطرة غرب"],
        "المنوفية": ["شبين الكوم", "منوف", "السادات", "أشمون", "سرس الليان"],
        "المنيا": ["المنيا", "ملوي", "مطاي", "بني مزار", "سمالوط"],
        "القليوبية": ["بنها", "شبرا الخيمة", "قليوب", "طوخ", "قها"],
        "الوادي الجديد": ["الخارجة", "الداخلة", "الفرافرة", "باريس"],
        "السويس": ["السويس", "عتاقة", "الجناين", "الأربعين"],
        "اسوان": ["أسوان", "دراو", "كوم أمبو", "إدفو", "نصر النوبة"],
        "اسيوط": ["أسيوط", "ديروط", "منفلوط", "أبنوب", "البداري"],
        "بني سويف": ["بني سويف", "الواسطى", "ناصر", "إهناسيا", "ببا"],
        "بورسعيد": ["بورسعيد", "بورفؤاد"],
        "دمياط": ["دمياط", "رأس البر", "فارسكور", "كفر سعد"],
        "الشرقية": ["الزقازيق", "العاشر من رمضان", "بلبيس", "منيا القمح", "فاقوس"],
        "جنوب سيناء": ["شرم الشيخ", "دهب", "نويبع", "الطور", "سانت كاترين"],
        "كفر الشيخ": ["كفر الشيخ", "دسوق", "سيدي سالم", "الحامول"],
        "مطروح": ["مرسى مطروح", "الحمام", "الضبعة", "سيدي براني"],
        "الأقصر": ["الأقصر", "إسنا", "أرمنت", "القرنة"],
        "قنا": ["قنا", "نجع حمادي", "دشنا", "قفط", "قوص"],
        "شمال سيناء": ["العريش", "رفح", "بئر العبد", "الشيخ زويد"],
        "سوهاج": ["سوهاج", "طهطا", "جرجا", "أخميم", "المراغة"]
    };

    const governorateSelect = document.getElementById('governorate');
    const citySelect = document.getElementById('city');

    governorateSelect.addEventListener('change', function() {
        const gov = this.value;
        citySelect.innerHTML = '<option value="">اختر المدينة</option>';
        if(governorateCities[gov]) {
            governorateCities[gov].forEach(function(city) {
                const opt = document.createElement('option');
                opt.value = city;
                opt.textContent = city;
                citySelect.appendChild(opt);
            });
        }
    });
});

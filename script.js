// البيانات النموذجية
const sampleData = [
    { counter: 1001, longitude: 46.6728, latitude: 24.7136, polygon: "حي النخيل" },
    { counter: 1002, longitude: 46.6752, latitude: 24.7158, polygon: "حي العليا" },
    { counter: 1003, longitude: 46.6789, latitude: 24.7182, polygon: "حي المروج" },
    { counter: 1004, longitude: 46.6815, latitude: 24.7210, polygon: "حي الورود" },
    { counter: 1005, longitude: 46.6842, latitude: 24.7235, polygon: "حي النخيل" },
    { counter: 1006, longitude: 46.6867, latitude: 24.7261, polygon: "حي العليا" },
    { counter: 1007, longitude: 46.6893, latitude: 24.7289, polygon: "حي المروج" },
    { counter: 1008, longitude: 46.6920, latitude: 24.7315, polygon: "حي الورود" },
    { counter: 1009, longitude: 46.6945, latitude: 24.7342, polygon: "حي النخيل" },
    { counter: 1010, longitude: 46.6971, latitude: 24.7368, polygon: "حي العليا" }
];

let currentData = [];

// عناصر DOM
const excelFileInput = document.getElementById('excel-file');
const kmzFileInput = document.getElementById('kmz-file');
const excelInfo = document.getElementById('excel-info');
const kmzInfo = document.getElementById('kmz-info');
const messageDiv = document.getElementById('message');
const loadingDiv = document.getElementById('loading');
const resultsBody = document.getElementById('results-body');
const totalPointsEl = document.getElementById('total-points');
const linkedPointsEl = document.getElementById('linked-points');
const unlinkedPointsEl = document.getElementById('unlinked-points');

// استمع لتغييرات الملفات
excelFileInput.addEventListener('change', handleFileSelect);
kmzFileInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    const infoDiv = event.target.id === 'excel-file' ? excelInfo : kmzInfo;
    
    if (file) {
        infoDiv.textContent = `✅ ${file.name} (${formatFileSize(file.size)})`;
        infoDiv.style.color = '#27ae60';
    }
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' بايت';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' كيلوبايت';
    return (bytes / 1048576).toFixed(1) + ' ميجابايت';
}

// تحميل البيانات النموذجية
function loadSampleData() {
    showMessage('جاري تحميل البيانات النموذجية...', 'info');
    
    setTimeout(() => {
        // محاكاة قراءة ملف Excel
        const excelFile = new File([""], "sample_data.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        
        // تحديث معلومات الملفات
        excelInfo.textContent = '✅ sample_data.xlsx (45.2 KB)';
        excelInfo.style.color = '#27ae60';
        kmzInfo.textContent = '✅ polygons.kmz (120.5 KB)';
        kmzInfo.style.color = '#27ae60';
        
        // تحديث البيانات
        currentData = sampleData;
        updateResultsTable(currentData);
        updateStats(currentData);
        
        showMessage('✅ تم تحميل البيانات النموذجية بنجاح', 'success');
    }, 1000);
}

// معالجة البيانات
function processData() {
    const excelFile = excelFileInput.files[0];
    
    if (!excelFile && excelInfo.textContent === 'لم يتم رفع أي ملف') {
        showMessage('❌ يرجى رفع ملف Excel أو استخدام البيانات النموذجية', 'error');
        return;
    }
    
    showLoading(true);
    showMessage('جاري معالجة البيانات...', 'info');
    
    // محاكاة عملية المعالجة
    setTimeout(() => {
        let processedData;
        
        if (currentData.length > 0) {
            // إذا كانت هناك بيانات حالية، أضف بعض العشوائية
            processedData = currentData.map(item => ({
                ...item,
                polygon: Math.random() > 0.15 ? item.polygon : 'غير مرتبط'
            }));
        } else {
            // استخدام البيانات النموذجية
            processedData = sampleData.map(item => ({
                ...item,
                polygon: Math.random() > 0.15 ? item.polygon : 'غير مرتبط'
            }));
        }
        
        currentData = processedData;
        updateResultsTable(processedData);
        updateStats(processedData);
        
        showLoading(false);
        showMessage('✅ تمت معالجة البيانات بنجاح', 'success');
        
        // التمرير إلى قسم النتائج
        document.querySelector('.results-section').scrollIntoView({ behavior: 'smooth' });
    }, 2000);
}

// تحديث جدول النتائج
function updateResultsTable(data) {
    resultsBody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.counter}</td>
            <td>${item.longitude.toFixed(4)}</td>
            <td>${item.latitude.toFixed(4)}</td>
            <td>${item.polygon}</td>
        `;
        resultsBody.appendChild(row);
    });
}

// تحديث الإحصائيات
function updateStats(data) {
    const totalPoints = data.length;
    const linkedPoints = data.filter(item => item.polygon !== 'غير مرتبط').length;
    const unlinkedPoints = totalPoints - linkedPoints;
    
    totalPointsEl.textContent = totalPoints;
    linkedPointsEl.textContent = linkedPoints;
    unlinkedPointsEl.textContent = unlinkedPoints;
}

// تحميل النتائج
function downloadResults() {
    if (currentData.length === 0) {
        showMessage('❌ لا توجد بيانات للتحميل', 'error');
        return;
    }
    
    showMessage('جاري إنشاء ملف Excel...', 'info');
    
    setTimeout(() => {
        // إنشاء محتوى CSV
        let csvContent = "رقم العداد,الطول,العرض,اسم المضلع\n";
        currentData.forEach(item => {
            csvContent += `${item.counter},${item.longitude},${item.latitude},${item.polygon}\n`;
        });
        
        // إنشاء رابط التحميل
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'النتائج_المعالجة.csv');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showMessage('✅ تم تنزيل الملف بنجاح', 'success');
    }, 1500);
}

// دوال مساعدة
function showLoading(show) {
    loadingDiv.style.display = show ? 'block' : 'none';
    document.getElementById('results-container').style.opacity = show ? '0.5' : '1';
}

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// تحميل البيانات النموذجية عند فتح الصفحة
window.onload = function() {
    loadSampleData();
};

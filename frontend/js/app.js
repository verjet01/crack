// ===== Configuration =====
// 自动检测 API 地址：本地开发用当前域名，生产环境用 Vercel 后端
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? window.location.origin
  : 'https://crack-rgipg3end-wangneals-projects.vercel.app';
const API_URL = `${API_BASE}/api/v1`;

// ===== DOM Elements =====
const toast = document.getElementById('toast');
const licenseKeyTextarea = document.getElementById('licenseKey');
const resultDiv = document.getElementById('result');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  // Update domain in copy buttons
  updateDomain();
  
  // Load stats
  loadStats();
  
  // Smooth scrolling for nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Update active state
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});

// ===== Update Domain =====
function updateDomain() {
  const domain = window.location.host;
  document.querySelectorAll('.domain').forEach(el => {
    el.textContent = domain;
  });
}

// ===== Copy Command =====
async function copyCommand(os) {
  // 使用 GitHub Pages 域名作为激活命令地址
  const activateDomain = 'verjet01.github.io/crack';
  
  const commands = {
    windows: `irm ${activateDomain}|iex`,
    linux: `wget -q ${activateDomain} -O - | bash`,
    mac: `curl -Ls ${activateDomain} | bash`
  };
  
  try {
    await navigator.clipboard.writeText(commands[os]);
    showToast('✓ 命令已复制到剪贴板');
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = commands[os];
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      showToast('✓ 命令已复制到剪贴板');
    } catch (e) {
      showToast('✗ 复制失败，请手动复制');
    }
    
    document.body.removeChild(textarea);
  }
}

// ===== Generate License =====
async function generateLicense() {
  // Get selected products
  const selectedProducts = [];
  document.querySelectorAll('input[name="product"]:checked').forEach(checkbox => {
    selectedProducts.push(checkbox.value);
  });
  
  if (selectedProducts.length === 0) {
    showToast('✗ 请至少选择一个产品');
    return;
  }
  
  // Get form values
  const licenseName = document.getElementById('licenseName').value || 'ideacrack';
  const assigneeName = document.getElementById('assigneeName').value || '';
  const expiryDate = document.getElementById('expiryDate').value || '2099-12-31';
  
  // Build request body
  const requestBody = {
    productCode: selectedProducts.join(','),
    licenseName,
    assigneeName,
    expiryDate
  };
  
  // Disable button
  const generateBtn = document.querySelector('.generate-btn');
  generateBtn.disabled = true;
  generateBtn.textContent = '生成中...';
  
  try {
    const response = await fetch(`${API_URL}/license/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Show result
      licenseKeyTextarea.value = data.data.licenseKey;
      resultDiv.style.display = 'block';
      
      // Scroll to result
      resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      showToast('✓ 激活码生成成功');
    } else {
      showToast(`✗ 生成失败: ${data.errors?.join(', ') || data.error}`);
    }
  } catch (error) {
    console.error('Generate error:', error);
    showToast('✗ 网络错误，请稍后重试');
  } finally {
    // Re-enable button
    generateBtn.disabled = false;
    generateBtn.textContent = '生成激活码';
  }
}

// ===== Copy Result =====
async function copyResult() {
  const licenseKey = licenseKeyTextarea.value;
  
  if (!licenseKey) {
    showToast('✗ 没有可复制的内容');
    return;
  }
  
  try {
    await navigator.clipboard.writeText(licenseKey);
    showToast('✓ 激活码已复制到剪贴板');
  } catch (err) {
    // Fallback
    licenseKeyTextarea.select();
    
    try {
      document.execCommand('copy');
      showToast('✓ 激活码已复制到剪贴板');
    } catch (e) {
      showToast('✗ 复制失败，请手动复制');
    }
  }
}

// ===== Toggle FAQ =====
function toggleFaq(element) {
  const faqItem = element.parentElement;
  faqItem.classList.toggle('active');
}

// ===== Load Stats =====
async function loadStats() {
  try {
    const response = await fetch(`${API_URL}/stats/usage`);
    const data = await response.json();
    
    if (data.success) {
      const stats = data.data;
      
      // Update UI
      document.getElementById('todayTotal').textContent = stats.today.total || 0;
      document.getElementById('windowsCount').textContent = stats.today.windows || 0;
      document.getElementById('macLinuxCount').textContent = 
        (stats.today.mac || 0) + (stats.today.linux || 0);
    }
  } catch (error) {
    console.error('Load stats error:', error);
  }
}

// ===== Show Toast =====
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements
document.querySelectorAll('.copy-btn, .download-card, .faq-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ===== Auto-refresh Stats =====
setInterval(loadStats, 60000); // Refresh every minute

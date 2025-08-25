(function(){
  'use strict';

  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }

  function loadState(){
    try { return JSON.parse(localStorage.getItem('nova_app')||'{}'); } catch(e){ return {}; }
  }
  function saveState(state){ localStorage.setItem('nova_app', JSON.stringify(state)); }

  function formatBytes(bytes){
    if(!bytes && bytes !== 0) return '';
    const units = ['B','KB','MB','GB'];
    let u = 0; let b = bytes;
    while(b >= 1024 && u < units.length-1){ b/=1024; u++; }
    return b.toFixed(b<10?1:0) + ' ' + units[u];
  }

  function attachValidation(){
    qsa('form').forEach(function(form){
      form.addEventListener('submit', function(e){
        if(!form.checkValidity()){
          e.preventDefault();
          e.stopPropagation();
          var firstInvalid = form.querySelector(':invalid');
          if(firstInvalid){ try{ firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' }); firstInvalid.focus(); }catch(_){} }
        }
        form.classList.add('was-validated');
      });

      qsa('input, select, textarea', form).forEach(function(ctrl){
        ctrl.addEventListener('input', function(){
          if(form.classList.contains('was-validated')){
            if(ctrl.checkValidity()){
              ctrl.classList.remove('invalid');
              ctrl.classList.add('valid');
            } else {
              ctrl.classList.remove('valid');
              ctrl.classList.add('invalid');
            }
          }
        });
      });
    });
  }

  function attachPasswordMatch(){
    var pass = qs('#password');
    var confirm = qs('#confirm');
    if(pass && confirm){
      function validate(){
        if(confirm.value && pass.value !== confirm.value){
          confirm.setCustomValidity('Passwords do not match');
        } else {
          confirm.setCustomValidity('');
        }
      }
      pass.addEventListener('input', validate);
      confirm.addEventListener('input', validate);
    }
  }

  function initDropzones(){
    qsa('[data-dropzone]').forEach(function(wrapper){
      var input = wrapper.querySelector('input[type="file"]');
      var list = wrapper.querySelector('[data-previews]');
      if(!input || !list) return;

      function clearPreviews(){ list.innerHTML = ''; }
      function addPreview(file){
        var item = document.createElement('div');
        item.className = 'dz-item';
        var thumb = document.createElement('div'); thumb.className='dz-thumb';
        var meta = document.createElement('div'); meta.className='dz-meta';
        meta.innerHTML = '<div class="dz-name">'+file.name+'</div><div class="dz-size">'+formatBytes(file.size)+'</div>';
        if(file.type.startsWith('image/')){
          var img = document.createElement('img');
          img.alt = file.name;
          img.onload = function(){ URL.revokeObjectURL(img.src); };
          img.src = URL.createObjectURL(file);
          thumb.appendChild(img);
        } else {
          thumb.textContent = '📄';
        }
        item.appendChild(thumb);
        item.appendChild(meta);
        list.appendChild(item);
      }

      function handleFiles(files){
        clearPreviews();
        Array.from(files).slice(0,5).forEach(addPreview);
        input.files = files;
      }

      wrapper.addEventListener('dragover', function(e){ e.preventDefault(); wrapper.classList.add('dragover'); });
      wrapper.addEventListener('dragleave', function(){ wrapper.classList.remove('dragover'); });
      wrapper.addEventListener('drop', function(e){
        e.preventDefault(); wrapper.classList.remove('dragover');
        if(e.dataTransfer && e.dataTransfer.files){ handleFiles(e.dataTransfer.files); }
      });
      wrapper.addEventListener('click', function(e){
        var btn = e.target.closest('button');
        var listEl = e.target.closest('[data-previews]');
        if(btn === null && listEl === null){ input.click(); }
      });

      input.addEventListener('change', function(){ if(input.files) handleFiles(input.files); });
    });
  }

  function handleRegister(){
    var form = qs('form[action="dashboard.html"]');
    var title = qs('#register-title');
    if(!form || !title) return;
    form.addEventListener('submit', function(e){
      if(!form.checkValidity()) return;
      var state = loadState();
      state.profile = {
        firstName: qs('#firstName') ? qs('#firstName').value : '',
        lastName: qs('#lastName') ? qs('#lastName').value : '',
        email: qs('#email') ? qs('#email').value : ''
      };
      state.status = 'Registered';
      state.documents = state.documents || [];
      saveState(state);
    });
  }

  function handleApplication(){
    var form = qs('#application-form');
    if(!form) return;
    form.addEventListener('submit', function(e){
      if(!form.checkValidity()) return;
      var state = loadState();
      var docInputs = qsa('input[type="file"]', form);
      var docs = [];
      docInputs.forEach(function(inp){
        if(inp.files && inp.files.length){
          for(var i=0;i<inp.files.length;i++){ docs.push({ name: inp.files[i].name, size: inp.files[i].size, type: inp.files[i].type }); }
        }
      });
      state.documents = docs; state.requiredDocs = ['photo','signature','idproof','sscMarksheet','hscMarksheet'];
      state.status = docs.length >= 3 ? 'In Progress' : 'Started';
      saveState(state);
    });
  }

  function renderDashboard(){
    var statusEl = qs('#kpi-status');
    var docsEl = qs('#kpi-docs');
    if(!statusEl && !docsEl) return;
    var state = loadState();
    if(statusEl) statusEl.textContent = state.status || 'Not Started';
    if(docsEl) docsEl.textContent = ((state.documents||[]).length) + ' / 5';
  }

  function initMobileNav(){
    var toggle = qs('.nav-toggle');
    var nav = qs('#primary-nav');
    if(!toggle || !nav) return;
    function setOpen(isOpen){
      toggle.setAttribute('aria-expanded', String(!!isOpen));
      nav.classList.toggle('open', !!isOpen);
    }
    toggle.addEventListener('click', function(){
      var open = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!open);
    });
    document.addEventListener('click', function(e){
      if(!nav.classList.contains('open')) return;
      if(e.target.closest('#primary-nav') || e.target.closest('.nav-toggle')) return;
      setOpen(false);
    });
    qsa('#primary-nav a').forEach(function(a){ a.addEventListener('click', function(){ setOpen(false); }); });
  }

  document.addEventListener('DOMContentLoaded', function(){
    attachValidation();
    attachPasswordMatch();
    initDropzones();
    handleRegister();
    handleApplication();
    renderDashboard();
    initMobileNav();
  });
})();

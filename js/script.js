//TODO: fazer a lógica para preencher uma tabela com os carros, o serviço envia

(function(win, doc, DOM) {
  "use strict";
  let app = (() => {
    let $tab;
    let $form;
    let $inputs;
    let $initial;
    let $brand;
    let $model;
    let $version;
    let $reset;
    let $search;

    return {

      init: function init () {
        initiateVariables();
        app.handleChange(
          $initial.get(),
          generateXHRparams("0", "initial")
        );

        $brand.on("change", () => {
          app.handleChange(
            $model.get(),
            generateXHRparams($brand.get().value, $brand.get().getAttribute("data-target")))
        });

        $model.on("change", () => {
          app.handleChange(
            $version.get(),
            generateXHRparams($model.get().value, $model.get().getAttribute("data-target")))
        });

        $tab.on("click", tabContentLoader);

        $reset.on("click", reset);

        //TODO: matido apenas para avisar o avaliador
        $search.get().addEventListener("click", function () { alert("O serviço swagger está desabilitado.") });
      },

      //TODO: matido pra se caso o service worker enviasse dados para motos
      handleChange: function handleChange(targetElement, serviceURL) {
        setService(targetElement, serviceURL);
      },

      removeBlock: function removeBlock() {
        return this.removeAttribute("disabled");
      }
    };

    function initiateVariables() {
      $tab = DOM('[data-js="tab"]');
      $form = DOM('[data-js="form"]');
      $inputs = DOM('[data-js="form"] input, [data-js="form"] select');
      $initial = DOM('[data-js="brand"]');
      $brand = DOM('[data-js="brand"]');
      $model = DOM('[data-js="model"]');
      $version = DOM('[data-js="version"]');
      $reset = DOM('[data-js="reset"]');
      $search = DOM('[data-js="search"]');
    }

    function tabContentLoader(e) {
      if (e.target.parentElement.classList.contains("active")) {
        return;
      }
      $tab.forEach(item => {
        item.classList.toggle("active");
      });
      $form.get().classList.toggle("active");
      reset($inputs);
    }

    function setService(targetElement, serviceURL) {
      const xhr = new win.XMLHttpRequest();
      xhr.open("get", serviceURL);
      xhr.send();
      xhr.addEventListener("readystatechange", initiateXhr);

      function initiateXhr() {
        if( !isRequestOk() )
          return;
        let serviceData;
        serviceData = JSON.parse(xhr.responseText);
        return populateSelectBody(targetElement, serviceData);
      }

      function isRequestOk() {
        return xhr.readyState === 4 && xhr.status === 200;
      }
    }

    function generateXHRparams (targetID, targetType) {
      let params = {
        initial: {
          url: "http://desafioonline.webmotors.com.br/api/OnlineChallenge/Make"
        },
        model: {
          url: `http://desafioonline.webmotors.com.br/api/OnlineChallenge/Model?MakeID=${targetID}`
        },
        version: {
          url: `http://desafioonline.webmotors.com.br/api/OnlineChallenge/Version?ModelID=${targetID}`
        }
      }
      return params[targetType].url;
    }

    function populateSelectBody(targetElement, serviceData) {
      let domFragment = doc.createDocumentFragment();
      let $optgroup = targetElement.firstElementChild;
      let $firstOption = $optgroup.firstElementChild.cloneNode(true);
      $optgroup.innerHTML = "";
      $optgroup.appendChild($firstOption);
      serviceData.forEach(item => {
        let $option = doc.createElement("option");
        $option.value = item.ID;
        $option.innerText = item.Name;
        $option.classList.add("form__option");
        return $optgroup.appendChild($option);
      });
      domFragment.appendChild($optgroup);
      app.removeBlock.call(targetElement);
      if (targetElement === $version.get()) {
        app.removeBlock.call($search.get())
      }
      return targetElement.appendChild(domFragment);
    }

    function reset() {
      $inputs.forEach(item => {
        item.checked = false;
        item.value = "";
      });
    }

  })();

  win.webMotors = win.webMotors || {};
  win.webMotors.app = app;

})(window, document, window.webMotors.DOM);

window.webMotors.app.init();

window.console.error('%c Algumas considerações:', 'font-weight: bold; font-style: oblique; font-size:20px;')

window.console.warn(`\n Utilizei uma lib feita por mim para agilizar seleção de elementos e requisições XHR;
\n As abas estão via JS por isso resetam ao trocar, assim não é necessário duplicar o HTML;
\n As imagens tem qualidade ruim pois as mesmas foram retiradas do PDF da prova;
\n O CTA "ver ofertas" não retorna resultado pois não foi pedido na prova a tela de resultados";
\n O serviço envia apenas carros, logo não fiz a lógica para motos (que alteraria apenas os parâmetros enviados para as chamadas XHR através da função: 'handleChange';
\n Os seletores que utilizam 5px ou menos não estão utilizando  unidade REM pois é indiferente para o browser;
\n As cores das fontes e dos itens estão mais escuras que o PDF para poderem atingir a taxa mínima de contraste;
\n Não utilizei SASS pois achei o CSS pequeno;
\n Adicionei animação de focagem em todos os elementos interativos para facilitar a navegação pelo teclado.`)

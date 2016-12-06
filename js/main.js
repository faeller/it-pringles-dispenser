var parameters = defineParameters();

var on = parameters['on'];
var checkout = parameters['checkout'];
var product = parameters['product'];
var duesInEuro = (parameters['dues'] == null) ? null : parseFloat(parameters['dues']).toFixed(2);

function PaymentOption(name, value, payCallback)
{
	this.name = name;
	this.value = value;
	this.pay = function() {
	 if(payCallback != null) payCallback(); else duesInEuro -= value 
	}
}

function Product(name, priceInEuro)
{
	this.name = name;
	this.priceInEuro = priceInEuro;
}

var payment_options = [];

payment_options["paypal"] = new PaymentOption("Paypal", null, function() { duesInEuro = 0; });
payment_options["euro_500"] = new PaymentOption("500,00 €", 500);
payment_options["euro_200"] = new PaymentOption("200,00 €", 200);
payment_options["euro_100"] = new PaymentOption("100,00 €", 100);
payment_options["euro_50"] = new PaymentOption("50,00 €", 50);
payment_options["euro_20"] = new PaymentOption("20,00 €", 20);
payment_options["euro_10"] = new PaymentOption("10,00 €", 10);
payment_options["euro_5"] = new PaymentOption("5,00 €", 5);
payment_options["euro_2"] = new PaymentOption("2,00 €", 2);
payment_options["euro_1"] = new PaymentOption("1,00 €", 1);
payment_options["euro_50_cents"] = new PaymentOption("0,50 €", .5);
payment_options["euro_20_cents"] = new PaymentOption("0,20 €", .2);
payment_options["euro_10_cents"] = new PaymentOption("0,10 €", .1);
payment_options["euro_5_cents"] = new PaymentOption("0,05 €", .05);
payment_options["euro_2_cents"] = new PaymentOption("0,02 €", .02);
payment_options["euro_1_cents"] = new PaymentOption("0,01 €", .01);

var products = [];

products["original"] = new Product("Original", 2.49);
products["sourcream"] = new Product("Sour Cream & Onion", 2.48);
products["bbq"] = new Product("BBQ", 2.58);
products["saltvinegar"] = new Product("Salt & Vinegar", 2.49);
products["dillpickle"] = new Product("Dill & Pickle", 2.42);
products["ranch"] = new Product("Ranch", 2.17);
products["jalapeno"] = new Product("Jalapeno", 2.99);
products["pizza"] = new Product("Pizza", 2.62);
products["lightlysalted"] = new Product("Leicht Gesalzen", 2.43);
products["originalreducedfat"] = new Product("Original - Fettreduziert", 3.94);
products["sourcreamreducedfat"] = new Product("Sourcream & Onion - Fettreduziert", 3.99);

$(document).ready(function() 
{
	for(productKey in products)
		products[productKey].relativeImagePath = "img/" + productKey + ".png"

	for(paymentOptionKey in payment_options)
		payment_options[paymentOptionKey].relativeImagePath = "img/" + paymentOptionKey + ".png";

	if(on == null)
	{
		jQuery('<a/>', 
		{
			id: 'dispenser-offline',
			href: '?on=true',
			title: 'Automaten anschalten!',
			rel: 'internal',
			text: 'Automaten anschalten!',
			class: "btn btn-success"
		}).appendTo('body');
		
		return;
	}

	if(product == null && checkout == null)
	{
		jQuery('<h1/>', 
		{
			id: 'product-selection-title',
			text: 'Produktauswahl'
		}).appendTo('div.container');
		
		for(productKey in products)
		{
			$product = products[productKey];
			console.log($product);
			
			$productWrapper = jQuery('<div/>', { class: 'col-md-2 column productbox' 
			}).appendTo('div.container');
			
			jQuery('<img/>', { class: 'product-image img-responsive', src: $product.relativeImagePath
			}).appendTo($productWrapper);
			
			jQuery('<div/>', { class: 'producttitle', text: $product.name
			}).appendTo($productWrapper);

			$priceWrapper = jQuery('<div/>', { class: 'productprice',
			}).appendTo($productWrapper);

			$pullRightWrapper = jQuery('<div/>', { class: 'pull-right',
			}).appendTo($priceWrapper);
		
			jQuery('<a/>', {
				class: 'btn btn-danger btn-sm',
				role: "button",
				text: "Kaufen",
				href: '?on=true&product=' + productKey + "&dues=" + $product.priceInEuro,
				title: 'Produkt kaufen!',
				rel: 'internal',
			}).appendTo($pullRightWrapper);

			jQuery('<div/>', { class: 'pricetext', text: $product.priceInEuro.toFixed(2) + " €"
			}).appendTo($productWrapper)
		}
		
		return;
	}

	if(duesInEuro > 0 && checkout == null)
	{
		jQuery('<h1/>', {
			id: 'paymentoption-selection-title',
			text: 'Bezahlvorgang'
		}).appendTo('div.container');

		jQuery('<h2/>', {
			id: 'paymentoption-selection-subtitle',
			text: 'Noch zu zahlen: ' + duesInEuro + '€'
		}).appendTo('div.container');

		for(optionKey in payment_options)
		{
			$option = payment_options[optionKey];
			
			$productWrapper = jQuery('<div/>', { class: 'col-md-2 column productbox' 
			}).appendTo('div.container');
			
			jQuery('<img/>', { class: 'product-image img-responsive', src: $option.relativeImagePath
			}).appendTo($productWrapper);

			$priceWrapper = jQuery('<div/>', { class: 'productprice',
			}).appendTo($productWrapper);

			$pullRightWrapper = jQuery('<div/>', { class: 'pull-right',
			}).appendTo($priceWrapper);
		
			jQuery('<a/>', {
				class: 'btn btn-success btn-sm',
				role: "button",
				text: "Verwenden",
				href: 'javascript:pay(\'' + optionKey + '\');',
				title: 'Verwenden',
				rel: 'internal',
			}).appendTo($pullRightWrapper);

			jQuery('<div/>', { class: 'pricetext', text: $option.name
			}).appendTo($productWrapper)
		}

		return;
	}


	if(duesInEuro <= 0 && checkout == null)
	{
		jQuery('<h1/>', 
		{
			id: 'paymentoption-selection-title',
			text: 'Bezahlvorgang Abgeschlossen!'
		}).appendTo('div.container');

		jQuery('<h2/>', 
		{
			id: 'paymentoption-selection-subtitle',
			text: 'Rückgeld: ' + (duesInEuro * -1).toFixed(2) + '€'
		}).appendTo('div.container');

		if(duesInEuro < 0)
		{
			$leftToGenerate = duesInEuro * -1;
			$change = [];

			for(paymentOptionKey in payment_options)
			{
				if(paymentOptionKey === "paypal")
					continue;

				$option = payment_options[paymentOptionKey];

				while($option.value <= $leftToGenerate)
				{
					$change.push($option);
					$leftToGenerate -= $option.value;
					$leftToGenerate = $leftToGenerate.toFixed(2);
				}
			}

			$changeWrapper = jQuery('<div/>', 
			{
				class: 'change'
			}).appendTo('div.container');

			$change.forEach(function($option) 
			{
				jQuery('<img/>', 
				{
					class: 'paymentoption-image image-responsive',
					src: $option.relativeImagePath
				}).appendTo($changeWrapper);
			});
		}

		jQuery('<a/>', {
			class: 'checkout-button btn btn-success btn-lg',
			role: "button",
			text: "Abholen",
			href: '?on=true&checkout=' + product,
			title: 'Abholen',
			rel: 'internal',
		}).appendTo("div.container");
	}

	if(checkout != null)
	{
		jQuery('<h1/>', 
		{
			id: 'paymentoption-selection-title',
			text: 'Bezahlvorgang Abgeschlossen!'
		}).appendTo('div.container');

		jQuery('<h2/>', 
		{
			id: 'paymentoption-selection-subtitle',
			text: 'Produktausgabe'
		}).appendTo('div.container');

		jQuery('<img/>', { class: 'output-image img-responsive', src: products[checkout].relativeImagePath
		}).appendTo("div.container");
		
		jQuery('<a/>', {
			class: 'checkout-button btn btn-success btn-lg',
			role: "button",
			text: "Abholen",
			href: '?',
			title: 'Neues Produkt kaufen',
			rel: 'internal',
		}).appendTo("div.container");
	}
});

function pay(paymentOptionKey) 
{
	payment_options[paymentOptionKey].pay(); 

	location.href = location.href.slice(0, location.href.lastIndexOf('&')) + "&dues="+duesInEuro.toFixed(2);
}

function defineParameters() 
{
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
	
	function(m,key,value) { vars[key] = value; });

	return vars;
}

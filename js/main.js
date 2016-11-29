var parameters = defineParameters();

var on = parameters['on'];
var product = parameters['product'];
var duesInEuro = (parameters['dues'] == null) ? null : parseFloat(parameters['dues']).toFixed(2);

function PaymentOption(name, value, relativeImagePath, payCallback)
{
	this.name = name;
	this.value = value;
	this.pay = function() {
	 if(payCallback != null) payCallback(); else duesInEuro -= value 
	}
}

function Product(name, priceInEuro, relativeImagePath)
{
	this.name = name;
	this.priceInEuro = priceInEuro;
	this.relativeImagePath = relativeImagePath;
}

var payment_options = [];

payment_options["paypal"] = new PaymentOption("Paypal", null, "", function() { duesInEuro = 0; });
payment_options["euro_10_cents"] = new PaymentOption("0,10 €", .1, "");
payment_options["euro_20_cents"] = new PaymentOption("0,20 €", .2, "");
payment_options["euro_50_cents"] = new PaymentOption("0,50 €", .5, "");
payment_options["euro_1"] = new PaymentOption("1,00 €", 1, "");
payment_options["euro_2"] = new PaymentOption("2,00 €", 2, "");

var products = [];

products["original"] = new Product("Original", 2.50, "");

$(document).ready(function() 
{
	console.log('Dues: '+duesInEuro);

	if(on == null)
	{
		jQuery('<a/>', 
		{
			id: 'dispenser-offline',
			href: '?on=true',
			title: 'Automaten anschalten!',
			rel: 'internal',
			text: 'Automaten anschalten!'
		}).appendTo('body');
		
		return;
	}

	if(product == null)
	{
		jQuery('<h1/>', 
		{
			id: 'product-selection-title',
			text: 'Produktauswahl:'
		}).appendTo('body');
		
		for(productKey in products)
		{
			$product = products[productKey];
			console.log($product);
			
			$productWrapper = jQuery('<div/>', 
			{
				class: 'product'
			}).appendTo('body');
			
			jQuery('<div/>', 
			{
				class: 'product-image',
				text: 'Bild: ' + $product.relativeImagePath
			}).appendTo($productWrapper);
			
			jQuery('<div/>', 
			{
				class: 'product-name',
				text: 'Name: ' + $product.name
			}).appendTo($productWrapper);
					
			jQuery('<div/>', 
			{
				class: 'product-price',
				text: 'Preis: ' + $product.priceInEuro
			}).appendTo($productWrapper);
			
			jQuery('<a/>', 
			{
				class: 'product-buy',
				href: '?on=true&product=' + productKey + "&dues=" + $product.priceInEuro,
				title: 'Produkt kaufen!',
				rel: 'internal',
				text: 'Produkt kaufen!'
			}).appendTo($productWrapper);
		}
		
		return;
	}

	if(duesInEuro > 0)
	{
		jQuery('<h1/>', 
		{
			id: 'paymentoption-selection-title',
			text: 'Bezahlvorgang:'
		}).appendTo('body');

		jQuery('<h2/>', 
		{
			id: 'paymentoption-selection-subtitle',
			text: 'Noch zu zahlen: ' + duesInEuro + '€'
		}).appendTo('body');
		
		for(optionKey in payment_options)
		{
			$option = payment_options[optionKey];
			console.log($option);
			
			$optionWrapper = jQuery('<div/>', 
			{
				class: 'paymentoption'
			}).appendTo('body');
			
			jQuery('<div/>', 
			{
				class: 'paymentoption-image',
				text: 'Bild: '+$option.relativeImagePath
			}).appendTo($optionWrapper);
			
			jQuery('<div/>', 
			{
				class: 'paymentoption-name',
				text: 'Name: '+$option.name
			}).appendTo($optionWrapper);
					
			jQuery('<a/>', 
			{
				class: 'paymentoption-use',
				href: 'javascript:pay(\'' + optionKey + '\');',
				title: 'Zahlungsmethode verwenden!',
				rel: 'internal',
				text: 'Zahlungsmethode verwenden!'
			}).appendTo($optionWrapper);
		}
		
		return;
	}


	if(duesInEuro <= 0)
	{
		jQuery('<h1/>', 
		{
			id: 'paymentoption-selection-title',
			text: 'Bezahlvorgang Abgeschlossen!'
		}).appendTo('body');

		jQuery('<h2/>', 
		{
			id: 'paymentoption-selection-subtitle',
			text: 'Rückgeld: ' + (duesInEuro * -1).toFixed(2) + '€'
		}).appendTo('body');
	}

	if(duesInEuro < 0)
	{
		$left = duesInEuro * -1;
		$change = [];

		while($left >= 0)
		{
			for($paymentOptionKey in payment_options)
			{
				$option = payment_options[$paymentOptionKey];

				if($option.value == null)
					continue;

				if($left >= $option.value.toFixed(2))
				{
					$change.push($option);
					$left -= $option.value;
					$left = $left.toFixed(2); 
				}

				console.log($change);
			}
		}

		console.log('DONE!');
		console.log($change);
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
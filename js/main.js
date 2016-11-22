var parameters = defineParameters();

var on = parameters['on'];
var product = parameters['product'];
var duesInEuro = parameters['dues'];

function PaymentOption(name, relativeImagePath, payCallback)
{
	this.name = name;
	this.pay = function() { payCallback(); }
}

function Product(name, priceInEuro, relativeImagePath)
{
	this.name = name;
	this.priceInEuro = priceInEuro;
	this.relativeImagePath = relativeImagePath;
}

var payment_options = [];

payment_options["paypal"] = new PaymentOption("Paypal", "", function() { dues = 0; });
payment_options["euro_10_cents"] = new PaymentOption("0,10 €", "", function() { dues -= .1; });
payment_options["euro_20_cents"] = new PaymentOption("0,20 €", "", function() { dues -= .2; });
payment_options["euro_50_cents"] = new PaymentOption("0,50 €", "", function() { dues -= .5; });
payment_options["euro_1"] = new PaymentOption("1,00 €", "", function() { dues -= 1; });
payment_options["euro_2"] = new PaymentOption("1,00 €", "", function() { dues -= 1; });

var products = [];

products["original"] = new Product("Original", 2.50);


(function main()
{
	console.log(duesInEuro);

	if(on == null)
	{
	}

	if(product == null)
	{
		console.log('Product selection');
		return;
	}

	if(duesInEuro == null)
	{
		duesInEuro = products[product].priceInEuro;
		return;
	}

	if(duesInEuro < 0)
	{
		
	}

})();




function defineParameters() 
{
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
	
	function(m,key,value) { vars[key] = value; });

	return vars;
}

function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

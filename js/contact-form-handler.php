<?php 
$errors = '';
$myemail = 'info@elwebman.io';//<-----Put Your email address here.
require_once "newrecaptchalib.php";
$secret = "6LcNazwUAAAAAD8trVnjUskFVlKmmWn85EEUz98z";
$response = null;
$reCaptcha = new ReCaptcha($secret);
if(empty($_POST['name'])  || 
	empty($_POST['email']) || 
	empty($_POST['randomWordEmail']) || 
	empty($_POST['g-recaptcha-response']) || 
	empty($_POST['randomWordEmailDefinition']))
{
	$errors .= "\n Error: all fields are required";
}
if ($_POST["g-recaptcha-response"]) {
    $response = $reCaptcha->verifyResponse(
        $_SERVER["REMOTE_ADDR"],
        $_POST["g-recaptcha-response"]
    );
}
 if ($response != null && $response->success) {
    echo "success reponse form google reCaptcha, insert data into database.";
  } else {
	echo "Error: Please click to confirm you are not a robot.";
}
$name = $_POST['name']; 
$email_address = $_POST['email']; 
$randomWordEmailDefinition = $_POST['randomWordEmailDefinition']; 
$randomWordEmail = $_POST['randomWordEmail']; 

if (!preg_match(
	"/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i", 
	$email_address))
{
	$errors .= "\n Error: Invalid email address";
}
if( empty($errors))
{
	
	$to = $myemail; 
	$email_subject = "Contact form from : $name";
	$email_body = "Thank you for showing interest in ¡Te doy la palabra!. \n Please find below the details of your lesson today.".
	" Here are the details:\n Name: $name \n Email: $email_address \n Random Word: $randomWordEmail \n Definition: $randomWordEmailDefinition"; 
	// Always set content-type when sending HTML email
	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
	$headers .= 'From: <webmaster@elwebman.io>' . "\r\n";
	
	$headers .= "Reply-To: $email_address";
	
	mail($to,$email_subject,$email_body,$headers);
	//redirect to the 'thank you' page
	header('Location: http://api.elwebman.io/new/contact-form-thank-you.html');
} 
?>
<!DOCTYPE html>
<html>
<head>
	<title>Contact form handler</title>
</head>

<body>
	<!-- This page is displayed only if there is some error -->
	<?php
	echo nl2br($errors);
	?>


</body>
</html>
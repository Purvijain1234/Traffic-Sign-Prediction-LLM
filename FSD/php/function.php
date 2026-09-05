<!DOCTYPE html>
<html>
<head>
    <title>PHP Functions</title>
</head>
<body>

<?php

echo "<h1>PHP Functions</h1>";

function add($a, $b) {
    return $a + $b;
}

function subtract($a, $b) {
    return $a - $b;
}

function multiply($a, $b) {
    return $a * $b;
}

function divide($a, $b) {
    if ($b == 0) {
        return "Division by zero is not allowed.";
    }
    return $a / $b;
}

?>

<h2>Enter Two Numbers</h2>

<form method="post">

    First Number:
    <input type="number" name="num1" required>
    <br><br>

    Second Number:
    <input type="number" name="num2" required>
    <br><br>

    <input type="submit" name="calculate" value="Calculate">

</form>

<?php

if (isset($_POST["calculate"])) {

    $num1 = $_POST["num1"];
    $num2 = $_POST["num2"];

    echo "<h2>Function Examples</h2>";

    echo "First Number: $num1 <br>";
    echo "Second Number: $num2 <br><br>";

    echo "Addition: " . add($num1, $num2) . "<br>";
    echo "Subtraction: " . subtract($num1, $num2) . "<br>";
    echo "Multiplication: " . multiply($num1, $num2) . "<br>";
    echo "Division: " . divide($num1, $num2) . "<br>";
}

?>

</body>
</html>
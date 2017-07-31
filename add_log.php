<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
       <meta http-equiv="Content-type" content="text/html; charset=utf-8">
       <TITLE>FabLab Machine Authentication</TITLE>
        <link rel="stylesheet" href="css/style.css">
        <script src="./js/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" charset="utf-8">
            $(document).ready(function(){
            });
        </script>
    </head>
    <body>
        <form action="http://192.168.14.21:3000/logs" method="post">
            <h1>Add Log Entry</h1>
            <label for="machines">Machine</label>
            <select id="machines" name="mid">
                <option value="0">bitte auswählen</option>
                <?php
                    $pdo = new PDO('mysql:host=192.168.14.21;dbname=flauth', 'flauth', 'FabLab');
                    $sql = "SELECT * FROM machines";
                    foreach ($pdo->query($sql) as $row) {
                       echo '<option value="'.$row['mid'].'">'.$row['name'].'</option>';
                    }
                ?>
            </select><br />
            <label for="tags">User</label>
            <select id="tags" name="tid">
                <option value="0">biite auswählen</option>
                <?php
                    $sql = "SELECT * FROM tags";
                    foreach ($pdo->query($sql) as $row) {
                       echo '<option value="'.$row['tid'].'">'.$row['name'].'</option>';
                    }
                ?>
            </select><br />
            <label for="events">Event</label>
            <select id="events" name="eid">
                <option value="0">biite auswählen</option>
                <?php
                    $sql = "SELECT * FROM events";
                    foreach ($pdo->query($sql) as $row) {
                       echo '<option value="'.$row['eid'].'">'.$row['name'].'</option>';
                    }
                ?>
            </select><br />
            <label for="remarks">Remarks</label>
            <input type="text" name="remarks" />
            <input type="submit" value="Submit">
        </form>
    </body>
</html>
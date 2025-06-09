<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        "first_name",
        "last_name",
        "email",
        "phone",
        "password",
        "birth_date",
        "gender",
        "height",
        "weight",
        "diet_type_id",
        "goal_id",
        "activity_level_id",
        "calorie_target",
        "custom_diet",
        "custom_allergy"
    ];

    protected $hidden = ["password", "remember_token"];

    public function allergies()
    {
        return $this->belongsToMany(Allergy::class, 'user_allergies');
    }
    public function dietType()
    {
        return $this->belongsTo(DietType::class);
    }
    public function goal()
    {
        return $this->belongsTo(Goal::class);
    }
    public function activityLevel()
    {
        return $this->belongsTo(ActivityLevel::class);
    }
}
